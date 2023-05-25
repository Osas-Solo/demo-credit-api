import {isNameValid, isBankVerificationNumberValid, isAccountNumberValid, isPinValid, isAmountValid} from "../../utils/validator";

describe("validator.ts tests", () => {
    test("isNameValid test", () => {
        expect(isNameValid("Osaremhen")).toBe(true);
    });
    test("isNameValid test", () => {
        expect(isNameValid("O12S")).toBe(false);
    });

    test("isBankVerificationNumberValid test", () => {
        expect(isBankVerificationNumberValid("12345678901")).toBe(true);
    });
    test("isBankVerificationNumberValid test", () => {
        expect(isBankVerificationNumberValid("1234567890")).toBe(false);
    });

    test("isAccountNumberValid test", () => {
        expect(isAccountNumberValid("1234567890")).toBe(true);
    });
    test("isAccountNumberValid test", () => {
        expect(isAccountNumberValid("12345678901")).toBe(false);
    });

    test("isPinValid test", () => {
        expect(isPinValid("1234")).toBe(true);
    });
    test("isPinValid test", () => {
        expect(isPinValid("123e")).toBe(false);
    });

    test("isAmountValid test", () => {
        expect(isAmountValid("50000")).toBe(true);
    });
    test("isAmountValid test", () => {
        expect(isAmountValid("6000000")).toBe(false);
    });
});