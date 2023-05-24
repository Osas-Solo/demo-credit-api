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
}

export {isNameValid, isAccountNumberValid, isBankVerificationNumberValid, isPinValid};