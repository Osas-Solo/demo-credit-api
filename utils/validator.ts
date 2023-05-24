const isNameValid = (name: string): boolean => {
    return /^[a-zA-Z]*$/.test(name) && name.length > 0 && name.length <= 100;
};

const isBankVerificationNumberValid = (bvn: string): boolean => {
    return /[0-9]{11}/.test(bvn);
};

const isAccountNumberValid = (accountNumber: string): boolean => {
    return /[0-9]{10}/.test(accountNumber);
};

const isPinValid = (pin: string): boolean => {
    return /[0-9]{4}/.test(pin);
};

const isAmountValid = (amount: string): boolean => {
    //  the regex below checks if the amount is a positive number (> 0) with a maximum of 2 decimal places
    return /^[1-9][0-9]?(\.[0-9]{2})?/.test(amount) && Number(amount) <= 5_000_000;
}

export {isNameValid, isAccountNumberValid, isBankVerificationNumberValid, isPinValid, isAmountValid};