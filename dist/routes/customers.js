"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customers_1 = require("../api/customers");
const router = express_1.default.Router();
router.post("/", customers_1.signup);
router.get("/", customers_1.getAllCustomers);
router.get("/:accountNumber", customers_1.getCustomer);
module.exports = router;
