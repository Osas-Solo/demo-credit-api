"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const database_1 = require("../config/database");
const validator_1 = require("../utils/validator");
const signup = (request, response) => {
    const customer = request.body;
    try {
        const validationError = validateCustomer(customer);
        if (areCustomerDetailsValid(validationError)) {
            customer.accountNumber = generateAccountNumber();
            (0, database_1.knex)("customers").insert({
                first_name: customer.firstName,
                middle_name: customer.middleName,
                last_name: customer.lastName,
                bank_verification_number: customer.bankVerificationNumber,
                account_number: customer.accountNumber,
                pin: customer.pin,
            }).then(() => {
                const successResponse = {
                    status: 201,
                    message: "Account Creation Success",
                    data: customer,
                };
                console.log(successResponse);
                response.status(201).json(successResponse);
            });
        }
        else {
            const failureResponse = {
                status: 401,
                message: "Account Creation Failure",
                error: validationError,
            };
            console.log(failureResponse);
            response.status(401).json(failureResponse);
        }
    }
    catch (e) {
        const errorResponse = {
            status: 500,
            message: "Internal Server Error",
        };
        console.log(e);
        console.log(errorResponse);
        response.status(500).json(errorResponse);
    }
};
exports.signup = signup;
const validateCustomer = (customer) => {
    var _a;
    const customerError = {};
    if (customer.firstName === undefined || !(0, validator_1.isNameValid)(customer.firstName)) {
        customerError.firstNameError = "Sorry, first names can only contain alphabetic letters and cannot exceed " +
            "100 characters";
    }
    if (customer.middleName && ((_a = customer.middleName) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        if (!(0, validator_1.isNameValid)(customer.middleName)) {
            customerError.middleNameError = "Sorry, middle names can only contain alphabetic letters and cannot exceed " +
                "100 characters";
        }
    }
    if (customer.lastName === undefined || !(0, validator_1.isNameValid)(customer.lastName)) {
        customerError.lastNameError = "Sorry, last names can only contain alphabetic letters and cannot exceed " +
            "100 characters";
    }
    if (customer.bankVerificationNumber === undefined || !(0, validator_1.isBankVerificationNumberValid)(customer.bankVerificationNumber)) {
        customerError.bankVerificationNumberError = "Sorry, Bank Verification Numbers (BVNs) can only contain 11 digits";
    }
    if (customer.pin === undefined || !(0, validator_1.isPinValid)(customer.pin)) {
        customerError.pinError = "Sorry, pins can only contain 4 digits";
    }
    return customerError;
};
const areCustomerDetailsValid = (validationError) => {
    return Object.keys(validationError).length === 0;
};
const generateAccountNumber = () => {
    let accountNumber = "";
    for (let i = 1; i <= 10; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    (0, database_1.knex)("customers").where("account_number", accountNumber).first()
        .then((data) => {
        if (data) {
            throw new Error("Account Number In Use");
        }
    })
        .catch((e) => {
        generateAccountNumber();
    });
    return accountNumber;
};
