"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactions_1 = require("../api/transactions");
const router = express_1.default.Router();
router.post("/deposit", transactions_1.deposit);
router.post("/withdraw", transactions_1.withdraw);
router.post("/transfer/:accountNumber", transactions_1.transfer);
module.exports = router;
