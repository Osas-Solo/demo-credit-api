"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knex = void 0;
require("dotenv").config();
const databaseConfiguration = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
exports.knex = require("knex")({
    client: "mysql",
    connection: databaseConfiguration,
});
