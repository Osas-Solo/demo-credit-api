import request from "supertest";
import app from "../../app";
import {Customer} from "../../models/customers";

describe("POST /api/customers", () => {
    it("should return 201 if customer details are valid", async () => {
        const customerDetails: Customer = {
            firstName: "John",
            middleName: "Doe",
            lastName: "Doe",
            bankVerificationNumber: "12345678901",
            pin: "1234",
        };

        const response = await request(app).post("/api/customers").send(customerDetails);

        expect(response.status).toBe(201);
    });

    it("should return 401 if customer details are invalid", async () => {
        const customerDetails: Customer = {
            firstName: "kk9",
            middleName: "Doe",
            lastName: "Doe",
            bankVerificationNumber: "1234567890",
            pin: "123",
        };

        const response = await request(app).post("/api/customers").send(customerDetails);

        expect(response.status).toBe(401);
    });
});

describe("GET /api/customers", () => {
    it("should return 200 if all customers are retrieved", async () => {
        const response = await request(app).get("/api/customers");

        expect(response.status).toBe(200);
    });

    it("should return 200 if customer with the account number 3311490310 is retrieved", async () => {
        const response = await request(app).get("/api/customers/3311490310");

        expect(response.status).toBe(200);
    });

    it("should return 404 no customer with the account number 1111111111 is found", async () => {
        const response = await request(app).get("/api/customers/1111111111");

        expect(response.status).toBe(404);
    });
});