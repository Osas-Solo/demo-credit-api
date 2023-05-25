import {knex} from "../config/database";
import {Request, Response} from "express";
import {APIResponse, sendServerErrorResponse} from "../models/responses";
import {Customer} from "../models/customers";
import {isAccountNumberValid, isAmountValid, isPinValid} from "../utils/validator";
import {Transaction} from "../models/transactions";

const deposit = (request: Request, response: Response) => {
    const transaction: TransactionRequest = request.body;

    try {
        const validationError: TransactionValidationError = validateTransaction(transaction);

        if (areTransactionDetailsValid(validationError)) {
            knex("customers").where("account_number", transaction.accountNumber)
                .first()
                .then((customer: any) => {
                    if (customer) {
                        knex.select(knex.raw(`SHA(${transaction.pin}) AS hashedPin`)).first().then((result: any) => {
                            if (customer.pin === result.hashedPin) {
                                const customerProfile: Customer = {
                                    id: customer.id,
                                    firstName: customer.first_name,
                                    middleName: customer.middle_name,
                                    lastName: customer.last_name,
                                    accountNumber: customer.account_number,
                                }

                                knex("transactions").insert(
                                    {
                                        sender_id: customer.id,
                                        receiver_id: customer.id,
                                        amount: transaction.amount,
                                        type: "Deposit",
                                    }
                                ).then(() => {
                                    knex("customers").where("account_number", transaction.accountNumber)
                                        .update("account_balance", knex.raw("account_balance + ?", [transaction.amount]))
                                        .then(() => {
                                            knex("customers")
                                                .where("account_number", transaction.accountNumber)
                                                .first()
                                                .then((updatedCustomerProfile: any) => {
                                                    const transactionDetails: Transaction = {
                                                        sender: customerProfile,
                                                        receiver: customerProfile,
                                                        amount: Number(transaction.amount),
                                                        type: "Deposit",
                                                    };

                                                    const successResponse: APIResponse = {
                                                        status: 201,
                                                        message: "Deposit Success",
                                                        data: {
                                                            transaction: transactionDetails,
                                                            accountBalance: updatedCustomerProfile.account_balance,
                                                        },
                                                    };

                                                    console.log(successResponse);
                                                    response.status(201).json(successResponse);
                                                });
                                        })
                                });
                            } else {
                                const failureResponse: APIResponse = {
                                    status: 401,
                                    message: "Deposit Failure",
                                    error: "Sorry, the pin you entered is incorrect",
                                }

                                console.log(failureResponse);
                                response.status(401).json(failureResponse);
                            }
                        });
                    } else {
                        const notFoundResponse: APIResponse = {
                            status: 404,
                            message: "Deposit Failure",
                            error: `No customer with the account number ${transaction.accountNumber} could be found`,
                        };

                        console.log(notFoundResponse);
                        response.status(401).json(notFoundResponse);
                    }
                });
        } else {
            const failureResponse: APIResponse = {
                status: 401,
                message: "Deposit Failure",
                error: validationError,
            }

            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    } catch (e: any) {
        sendServerErrorResponse(e, response);
    }
};

const withdraw = (request: Request, response: Response) => {
    const transaction: TransactionRequest = request.body;

    try {
        const validationError: TransactionValidationError = validateTransaction(transaction);

        if (areTransactionDetailsValid(validationError)) {
            knex("customers").where("account_number", transaction.accountNumber)
                .first()
                .then((customer: any) => {
                    if (customer) {
                        knex.select(knex.raw(`SHA(${transaction.pin}) AS hashedPin`)).first().then((result: any) => {
                            if (customer.pin === result.hashedPin) {
                                if (transaction.amount <= customer.account_balance) {
                                    const customerProfile: Customer = {
                                        id: customer.id,
                                        firstName: customer.first_name,
                                        middleName: customer.middle_name,
                                        lastName: customer.last_name,
                                        accountNumber: customer.account_number,
                                    }

                                    knex("transactions").insert(
                                        {
                                            sender_id: customer.id,
                                            receiver_id: customer.id,
                                            amount: transaction.amount,
                                            type: "Withdrawal",
                                        }
                                    ).then(() => {
                                        knex("customers").where("account_number", transaction.accountNumber)
                                            .update("account_balance", knex.raw("account_balance - ?", [transaction.amount]))
                                            .then(() => {
                                                knex("customers")
                                                    .where("account_number", transaction.accountNumber)
                                                    .first()
                                                    .then((updatedCustomerProfile: any) => {
                                                        const transactionDetails: Transaction = {
                                                            sender: customerProfile,
                                                            receiver: customerProfile,
                                                            amount: Number(transaction.amount),
                                                            type: "Withdrawal",
                                                        };

                                                        const successResponse: APIResponse = {
                                                            status: 201,
                                                            message: "Withdrawal Success",
                                                            data: {
                                                                transaction: transactionDetails,
                                                                accountBalance: updatedCustomerProfile.account_balance,
                                                            },
                                                        };

                                                        console.log(successResponse);
                                                        response.status(201).json(successResponse);
                                                    });
                                            })
                                    });
                                } else {
                                    const failureResponse: APIResponse = {
                                        status: 401,
                                        message: "Withdrawal Failure",
                                        error: "Sorry, you do not have enough funds to make this withdrawal",
                                    }

                                    console.log(failureResponse);
                                    response.status(401).json(failureResponse);
                                }
                            } else {
                                const failureResponse: APIResponse = {
                                    status: 401,
                                    message: "Withdrawal Failure",
                                    error: "Sorry, the pin you entered is incorrect",
                                }

                                console.log(failureResponse);
                                response.status(401).json(failureResponse);
                            }
                        });
                    } else {
                        const notFoundResponse: APIResponse = {
                            status: 404,
                            message: "Withdrawal Failure",
                            error: `No customer with the account number ${transaction.accountNumber} could be found`,
                        }

                        console.log(notFoundResponse);
                        response.status(401).json(notFoundResponse);
                    }
                });
        } else {
            const failureResponse: APIResponse = {
                status: 401,
                message: "Withdrawal Failure",
                error: validationError,
            }

            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    } catch (e: any) {
        sendServerErrorResponse(e, response);
    }
};

const transfer = (request: Request, response: Response) => {
    const senderAccountNumber: string = request.params.accountNumber;
    const transaction: TransactionRequest = request.body;

    try {
        const validationError: TransactionValidationError = validateTransaction(transaction);

        if (areTransactionDetailsValid(validationError)) {
            knex("customers").where("account_number", transaction.accountNumber)
                .first()
                .then((receiver: any) => {
                    if (receiver) {
                        const receiverProfile: Customer = {
                            id: receiver.id,
                            firstName: receiver.first_name,
                            middleName: receiver.middle_name,
                            lastName: receiver.last_name,
                            accountNumber: receiver.account_number,
                        };

                        knex("customers").where({
                            account_number: senderAccountNumber,
                            pin: knex.raw(`SHA(${transaction.pin})`)
                        })
                            .first()
                            .then((sender: any) => {
                                if (sender) {
                                    if (transaction.amount <= sender.account_balance) {
                                        const senderProfile: Customer = {
                                            id: sender.id,
                                            firstName: sender.first_name,
                                            middleName: sender.middle_name,
                                            lastName: sender.last_name,
                                            accountNumber: sender.account_number,
                                        };

                                        knex("transactions").insert(
                                            {
                                                sender_id: sender.id,
                                                receiver_id: receiver.id,
                                                amount: transaction.amount,
                                                type: "Transfer",
                                            }
                                        ).then(() => {
                                            knex("customers").where("account_number", senderAccountNumber)
                                                .update("account_balance", knex.raw("account_balance - ?", [transaction.amount]))
                                                .then(() => {
                                                    knex("customers").where("account_number", transaction.accountNumber)
                                                        .update("account_balance", knex.raw("account_balance + ?", [transaction.amount]))
                                                        .then();

                                                    knex("customers")
                                                        .where("account_number", senderAccountNumber)
                                                        .first()
                                                        .then((updatedCustomerProfile: any) => {
                                                            const transactionDetails: Transaction = {
                                                                sender: senderProfile,
                                                                receiver: receiverProfile,
                                                                amount: Number(transaction.amount),
                                                                type: "Transfer",
                                                            };

                                                            const successResponse: APIResponse = {
                                                                status: 201,
                                                                message: "Transfer Success",
                                                                data: {
                                                                    transaction: transactionDetails,
                                                                    accountBalance: updatedCustomerProfile.account_balance,
                                                                },
                                                            };

                                                            console.log(successResponse);
                                                            response.status(201).json(successResponse);
                                                        });
                                                })
                                        });
                                    } else {
                                        const failureResponse: APIResponse = {
                                            status: 401,
                                            message: "Transfer Failure",
                                            error: "Sorry, you do not have enough funds to make this withdrawal",
                                        }

                                        console.log(failureResponse);
                                        response.status(401).json(failureResponse);
                                    }
                                } else {
                                    const failureResponse: APIResponse = {
                                        status: 401,
                                        message: "Transfer Failure",
                                        error: "Sorry, your account number or pin might be incorrect",
                                    };

                                    console.log(failureResponse);
                                    response.status(401).json(failureResponse);
                                }
                            });
                    } else {
                        const notFoundResponse: APIResponse = {
                            status: 404,
                            message: "Transfer Failure",
                            error: `No customer with the account number ${transaction.accountNumber} could be found`,
                        }

                        console.log(notFoundResponse);
                        response.status(401).json(notFoundResponse);
                    }
                });
        } else {
            const failureResponse: APIResponse = {
                status: 401,
                message: "Transfer Failure",
                error: validationError,
            }

            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    } catch (e: any) {
        sendServerErrorResponse(e, response);
    }
};

interface TransactionRequest {
    accountNumber: string,
    pin: string,
    amount: string,
}

interface TransactionValidationError {
    accountNumberError?: string,
    pinError?: string,
    amountError?: string,
}

const validateTransaction = (transaction: TransactionRequest): TransactionValidationError => {
    const transactionError: TransactionValidationError = {};

    if (transaction.accountNumber === undefined || !isAccountNumberValid(transaction.accountNumber)) {
        transactionError.accountNumberError = "Sorry, account numbers must contain 10 digits";
    }

    if (transaction.pin === undefined || !isPinValid(transaction.pin)) {
        transactionError.pinError = "Sorry, pins must contain 4 digits";
    }

    if (transaction.amount === undefined || !isAmountValid(transaction.amount)) {
        transactionError.amountError = "Sorry, amount must begin with a non-zero digit, can only be denoted with 2 " +
            "decimal places and must not exceed 5 million";
    }

    return transactionError;
};

const areTransactionDetailsValid = (validationError: TransactionValidationError) => {
    return Object.keys(validationError).length === 0;
};

export {deposit, withdraw, transfer};