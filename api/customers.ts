import {knex} from "../config/database";
import {Request, Response} from "express";
import {APIResponse} from "../models/responses";
import {Customer} from "../models/customers";
import {isBankVerificationNumberValid, isNameValid, isPinValid} from "../utils/validator";

const signup = (request: Request, response: Response) => {
    const customer: Customer = request.body;

    try {
        const validationError: CustomerValidationError = validateCustomer(customer);

        if (areCustomerDetailsValid(validationError)) {
            customer.accountNumber = generateAccountNumber();

            knex("customers").insert(
                {
                    first_name: customer.firstName,
                    middle_name: customer.middleName,
                    last_name: customer.lastName,
                    bank_verification_number: customer.bankVerificationNumber,
                    account_number: customer.accountNumber,
                    pin: customer.pin,
                }
            ).then(() => {
                const successResponse: APIResponse = {
                    status: 201,
                    message: "Account Creation Success",
                    data: customer,
                }

                console.log(successResponse);
                response.status(201).json(successResponse);
            });
        } else {
            const failureResponse: APIResponse = {
                status: 401,
                message: "Account Creation Failure",
                error: validationError,
            }

            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    } catch (e) {
        const errorResponse: APIResponse = {
            status: 500,
            message: "Internal Server Error",
        };

        console.log(e);
        console.log(errorResponse);
        response.status(500).json(errorResponse);
    }
}

interface CustomerValidationError {
    firstNameError?: string,
    middleNameError?: string,
    lastNameError?: string,
    bankVerificationNumberError?: string,
    pinError?: string,
}

const validateCustomer = (customer: Customer): CustomerValidationError => {
    const customerError: CustomerValidationError = {};

    if (customer.firstName === undefined || !isNameValid(customer.firstName)) {
        customerError.firstNameError = "Sorry, first names can only contain alphabetic letters and cannot exceed " +
            "100 characters";
    }

    if (customer.middleName && customer.middleName?.length > 0) {
        if (!isNameValid(customer.middleName)) {
            customerError.middleNameError = "Sorry, middle names can only contain alphabetic letters and cannot exceed " +
                "100 characters";
        }
    }

    if (customer.lastName === undefined || !isNameValid(customer.lastName)) {
        customerError.lastNameError = "Sorry, last names can only contain alphabetic letters and cannot exceed " +
            "100 characters";
    }

    if (customer.bankVerificationNumber === undefined || !isBankVerificationNumberValid(customer.bankVerificationNumber)) {
        customerError.bankVerificationNumberError = "Sorry, Bank Verification Numbers (BVNs) can only contain 11 digits";
    }

    if (customer.pin === undefined || !isPinValid(customer.pin)) {
        customerError.pinError = "Sorry, pins can only contain 4 digits";
    }

    return customerError;
}

const areCustomerDetailsValid = (validationError: CustomerValidationError) => {
    return Object.keys(validationError).length === 0;
};

const generateAccountNumber = (): string => {
    let accountNumber = "";

    for (let i = 1; i <= 10; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }

    knex("customers").where("account_number", accountNumber).first()
        .then((data: any) => {
            if (data) {
                throw new Error("Account Number In Use");
            }
        })
        .catch((e: any) => {
            generateAccountNumber();
        });

    return accountNumber;
};

export {signup};