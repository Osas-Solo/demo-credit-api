require("dotenv").config();

interface IDatabaseConfiguration {
    host: string | undefined,
    port: number | undefined,
    user: string | undefined,
    password: string | undefined,
    database: string | undefined,
}

const databaseConfiguration: IDatabaseConfiguration = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

export const knex = require("knex")({
    client: "mysql",
    connection: databaseConfiguration,
});