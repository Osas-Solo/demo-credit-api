"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.withdraw = exports.deposit = void 0;
const database_1 = require("../config/database");
const responses_1 = require("../models/responses");
const validator_1 = require("../utils/validator");
const deposit = (request, response) => {
    const transaction = request.body;
    try {
        const validationError = validateTransaction(transaction);
        if (areTransactionDetailsValid(validationError)) {
            (0, database_1.knex)("customers").where("account_number", transaction.accountNumber)
                .first()
                .then((customer) => {
                if (customer) {
                    database_1.knex.select(database_1.knex.raw(`SHA(${transaction.pin}) AS hashedPin`)).first().then((result) => {
                        if (customer.pin === result.hashedPin) {
                            const customerProfile = {
                                id: customer.id,
                                firstName: customer.first_name,
                                middleName: customer.middle_name,
                                lastName: customer.last_name,
                                accountNumber: customer.account_number,
                            };
                            (0, database_1.knex)("transactions").insert({
                                sender_id: customer.id,
                                receiver_id: customer.id,
                                amount: transaction.amount,
                                type: "Deposit",
                            }).then(() => {
                                (0, database_1.knex)("customers").where("account_number", transaction.accountNumber)
                                    .update("account_balance", database_1.knex.raw("account_balance + ?", [transaction.amount]))
                                    .then(() => {
                                    (0, database_1.knex)("customers")
                                        .where("account_number", transaction.accountNumber)
                                        .first()
                                        .then((updatedCustomerProfile) => {
                                        const transactionDetails = {
                                            sender: customerProfile,
                                            receiver: customerProfile,
                                            amount: Number(transaction.amount),
                                            type: "Deposit",
                                        };
                                        const successResponse = {
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
                                });
                            });
                        }
                        else {
                            const failureResponse = {
                                status: 401,
                                message: "Deposit Failure",
                                error: "Sorry, the pin you entered is incorrect",
                            };
                            console.log(failureResponse);
                            response.status(401).json(failureResponse);
                        }
                    });
                }
                else {
                    const notFoundResponse = {
                        status: 404,
                        message: "Deposit Failure",
                        error: `No customer with the account number ${transaction.accountNumber} could be found`,
                    };
                    console.log(notFoundResponse);
                    response.status(401).json(notFoundResponse);
                }
            });
        }
        else {
            const failureResponse = {
                status: 401,
                message: "Deposit Failure",
                error: validationError,
            };
            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    }
    catch (e) {
        (0, responses_1.sendServerErrorResponse)(e, response);
    }
};
exports.deposit = deposit;
const withdraw = (request, response) => {
    const transaction = request.body;
    try {
        const validationError = validateTransaction(transaction);
        if (areTransactionDetailsValid(validationError)) {
            (0, database_1.knex)("customers").where("account_number", transaction.accountNumber)
                .first()
                .then((customer) => {
                if (customer) {
                    database_1.knex.select(database_1.knex.raw(`SHA(${transaction.pin}) AS hashedPin`)).first().then((result) => {
                        if (customer.pin === result.hashedPin) {
                            if (transaction.amount <= customer.account_balance) {
                                const customerProfile = {
                                    id: customer.id,
                                    firstName: customer.first_name,
                                    middleName: customer.middle_name,
                                    lastName: customer.last_name,
                                    accountNumber: customer.account_number,
                                };
                                (0, database_1.knex)("transactions").insert({
                                    sender_id: customer.id,
                                    receiver_id: customer.id,
                                    amount: transaction.amount,
                                    type: "Withdrawal",
                                }).then(() => {
                                    (0, database_1.knex)("customers").where("account_number", transaction.accountNumber)
                                        .update("account_balance", database_1.knex.raw("account_balance - ?", [transaction.amount]))
                                        .then(() => {
                                        (0, database_1.knex)("customers")
                                            .where("account_number", transaction.accountNumber)
                                            .first()
                                            .then((updatedCustomerProfile) => {
                                            const transactionDetails = {
                                                sender: customerProfile,
                                                receiver: customerProfile,
                                                amount: Number(transaction.amount),
                                                type: "Withdrawal",
                                            };
                                            const successResponse = {
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
                                    });
                                });
                            }
                            else {
                                const failureResponse = {
                                    status: 401,
                                    message: "Withdrawal Failure",
                                    error: "Sorry, you do not have enough funds to make this withdrawal",
                                };
                                console.log(failureResponse);
                                response.status(401).json(failureResponse);
                            }
                        }
                        else {
                            const failureResponse = {
                                status: 401,
                                message: "Withdrawal Failure",
                                error: "Sorry, the pin you entered is incorrect",
                            };
                            console.log(failureResponse);
                            response.status(401).json(failureResponse);
                        }
                    });
                }
                else {
                    const notFoundResponse = {
                        status: 404,
                        message: "Withdrawal Failure",
                        error: `No customer with the account number ${transaction.accountNumber} could be found`,
                    };
                    console.log(notFoundResponse);
                    response.status(401).json(notFoundResponse);
                }
            });
        }
        else {
            const failureResponse = {
                status: 401,
                message: "Withdrawal Failure",
                error: validationError,
            };
            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    }
    catch (e) {
        (0, responses_1.sendServerErrorResponse)(e, response);
    }
};
exports.withdraw = withdraw;
const transfer = (request, response) => {
    const senderAccountNumber = request.params.accountNumber;
    const transaction = request.body;
    try {
        const validationError = validateTransaction(transaction);
        if (areTransactionDetailsValid(validationError)) {
            (0, database_1.knex)("customers").where("account_number", transaction.accountNumber)
                .first()
                .then((receiver) => {
                if (receiver) {
                    const receiverProfile = {
                        id: receiver.id,
                        firstName: receiver.first_name,
                        middleName: receiver.middle_name,
                        lastName: receiver.last_name,
                        accountNumber: receiver.account_number,
                    };
                    (0, database_1.knex)("customers").where({
                        account_number: senderAccountNumber,
                        pin: database_1.knex.raw(`SHA(${transaction.pin})`)
                    })
                        .first()
                        .then((sender) => {
                        if (sender) {
                            if (transaction.amount <= sender.account_balance) {
                                const senderProfile = {
                                    id: sender.id,
                                    firstName: sender.first_name,
                                    middleName: sender.middle_name,
                                    lastName: sender.last_name,
                                    accountNumber: sender.account_number,
                                };
                                (0, database_1.knex)("transactions").insert({
                                    sender_id: sender.id,
                                    receiver_id: receiver.id,
                                    amount: transaction.amount,
                                    type: "Transfer",
                                }).then(() => {
                                    (0, database_1.knex)("customers").where("account_number", senderAccountNumber)
                                        .update("account_balance", database_1.knex.raw("account_balance - ?", [transaction.amount]))
                                        .then(() => {
                                        (0, database_1.knex)("customers").where("account_number", transaction.accountNumber)
                                            .update("account_balance", database_1.knex.raw("account_balance + ?", [transaction.amount]))
                                            .then();
                                        (0, database_1.knex)("customers")
                                            .where("account_number", senderAccountNumber)
                                            .first()
                                            .then((updatedCustomerProfile) => {
                                            const transactionDetails = {
                                                sender: senderProfile,
                                                receiver: receiverProfile,
                                                amount: Number(transaction.amount),
                                                type: "Transfer",
                                            };
                                            const successResponse = {
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
                                    });
                                });
                            }
                            else {
                                const failureResponse = {
                                    status: 401,
                                    message: "Transfer Failure",
                                    error: "Sorry, you do not have enough funds to make this withdrawal",
                                };
                                console.log(failureResponse);
                                response.status(401).json(failureResponse);
                            }
                        }
                        else {
                            const failureResponse = {
                                status: 401,
                                message: "Transfer Failure",
                                error: "Sorry, your account number or pin might be incorrect",
                            };
                            console.log(failureResponse);
                            response.status(401).json(failureResponse);
                        }
                    });
                }
                else {
                    const notFoundResponse = {
                        status: 404,
                        message: "Transfer Failure",
                        error: `No customer with the account number ${transaction.accountNumber} could be found`,
                    };
                    console.log(notFoundResponse);
                    response.status(401).json(notFoundResponse);
                }
            });
        }
        else {
            const failureResponse = {
                status: 401,
                message: "Transfer Failure",
                error: validationError,
            };
            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    }
    catch (e) {
        (0, responses_1.sendServerErrorResponse)(e, response);
    }
};
exports.transfer = transfer;
const validateTransaction = (transaction) => {
    const transactionError = {};
    if (transaction.accountNumber === undefined || !(0, validator_1.isAccountNumberValid)(transaction.accountNumber)) {
        transactionError.accountNumberError = "Sorry, account numbers must contain 10 digits";
    }
    if (transaction.pin === undefined || !(0, validator_1.isPinValid)(transaction.pin)) {
        transactionError.pinError = "Sorry, pins must contain 4 digits";
    }
    if (transaction.amount === undefined || !(0, validator_1.isAmountValid)(transaction.amount)) {
        transactionError.amountError = "Sorry, amount must begin with a non-zero digit, can only be denoted with 2 " +
            "decimal places and must not exceed 5 million";
    }
    return transactionError;
};
const areTransactionDetailsValid = (validationError) => {
    return Object.keys(validationError).length === 0;
};
