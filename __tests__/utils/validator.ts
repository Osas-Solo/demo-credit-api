import {isNameValid, isBankVerificationNumberValid, isAccountNumberValid, isPinValid, isAmountValid} from "../../utils/validator";

describe("validator.ts tests", () => {
    it("should expect a name containing only letters and between 0 and at most 100 characters", () => {
        expect(isNameValid("Osaremhen")).toBe(true);
    });
    it("should expect a name containing only letters and between 0 and at most 100 characters", () => {
        expect(isNameValid("O12S")).toBe(false);
    });

    it("should expect only 11 digits", () => {
        expect(isBankVerificationNumberValid("12345678901")).toBe(true);
    });
    it("should expect only 11 digits", () => {
        expect(isBankVerificationNumberValid("1234567890")).toBe(false);
    });

    it("should expect only 10 digits", () => {
        expect(isAccountNumberValid("1234567890")).toBe(true);
    });
    it("should expect only 10 digits", () => {
        expect(isAccountNumberValid("12345678901")).toBe(false);
    });

    it("should expect only 4 digits", () => {
        expect(isPinValid("1234")).toBe(true);
    });
    it("should expect only 4 digits", () => {
        expect(isPinValid("123e")).toBe(false);
    });

    it("should start with a positive number, have only 2 decimal places and be <= 5,000,000", () => {
        expect(isAmountValid("50000")).toBe(true);
    });
    it("should start with a positive number, have only 2 decimal places and be <= 5,000,000", () => {
        expect(isAmountValid("6000000")).toBe(false);
    });
});