import request from "supertest";
import app from "../../app";
import {TransactionRequest} from "../../models/transactions";

describe("POST /api/transactions/deposit", () => {
    it("should return 200 if customer account number and transaction details are valid", async () => {
        const transaction: TransactionRequest = {
            accountNumber: "3311490310",
            pin: "1234",
            amount: "1000",
        };

        const response = await request(app).post("/api/transactions/deposit").send(transaction);

        expect(response.status).toBe(200);
    });

    it("should return 401 if customer account number or transaction details are invalid", async () => {
        const transaction: TransactionRequest = {
            accountNumber: "1111111111",
            pin: "123",
            amount: "1000",
        };

        const response = await request(app).post("/api/transactions/deposit").send(transaction);

        expect(response.status).toBe(401);
    });
});

describe("POST /api/transactions/withdraw", () => {
    it("should return 200 if customer account number and transaction details are valid", async () => {
        const transaction: TransactionRequest = {
            accountNumber: "3311490310",
            pin: "1234",
            amount: "1000",
        };

        const response = await request(app).post("/api/transactions/withdraw").send(transaction);

        expect(response.status).toBe(200);
    });

    it("should return 401 if customer account number or transaction details are invalid", async () => {
        const transaction: TransactionRequest = {
            accountNumber: "1111111111",
            pin: "123",
            amount: "1000",
        };

        const response = await request(app).post("/api/transactions/withdraw").send(transaction);

        expect(response.status).toBe(401);
    });
});

describe("POST /api/transactions/transfer", () => {
    it("should return 200 if sender's and receiver's account numbers and transaction details are valid", async () => {
        const transaction: TransactionRequest = {
            accountNumber: "1112222288",
            pin: "1234",
            amount: "1000",
        };

        const response = await request(app).post("/api/transactions/transfer/3311490310").send(transaction);

        expect(response.status).toBe(200);
    });

    it("should return 401 if sender's and receiver's account numbers or transaction details are invalid", async () => {
        const transaction: TransactionRequest = {
            accountNumber: "1111111111",
            pin: "123",
            amount: "1000",
        };

        const response = await request(app).post("/api/transactions/transfer/3311490310").send(transaction);

        expect(response.status).toBe(401);
    });
});