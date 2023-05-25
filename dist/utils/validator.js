"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAmountValid = exports.isPinValid = exports.isBankVerificationNumberValid = exports.isAccountNumberValid = exports.isNameValid = void 0;
const isNameValid = (name) => {
    return /^[a-zA-Z]*$/.test(name) && name.length > 0 && name.length <= 100;
};
exports.isNameValid = isNameValid;
const isBankVerificationNumberValid = (bvn) => {
    return /^[0-9]{11}$/.test(bvn);
};
exports.isBankVerificationNumberValid = isBankVerificationNumberValid;
const isAccountNumberValid = (accountNumber) => {
    return /^[0-9]{10}$/.test(accountNumber);
};
exports.isAccountNumberValid = isAccountNumberValid;
const isPinValid = (pin) => {
    return /^[0-9]{4}$/.test(pin);
};
exports.isPinValid = isPinValid;
const isAmountValid = (amount) => {
    //  the regex below checks if the amount is a positive number (> 0) with a maximum of 2 decimal places
    return /^[1-9][0-9]?(\.[0-9]{2})?/.test(amount) && Number(amount) <= 5000000;
};
exports.isAmountValid = isAmountValid;
