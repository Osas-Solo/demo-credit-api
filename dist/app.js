"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cors = require("cors");
const prettify = require("express-prettify");
const bodyParser = require("body-parser");
const customerRouter = require("./routes/customers");
const transactionRouter = require("./routes/transactions");
const app = (0, express_1.default)();
app.use(prettify({
    always: true,
    spaces: 4,
}));
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/customers", customerRouter);
app.use("/api/transactions", transactionRouter);
exports.default = app;
