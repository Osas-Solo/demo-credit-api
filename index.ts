import express, {Express} from 'express';
require("dotenv").config();

const cors = require("cors");
const prettify = require("express-prettify");
const bodyParser = require("body-parser");
const customerRouter = require("./routes/customers");

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(prettify({
    always: true,
    spaces: 4,
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/customers", customerRouter);

app.listen(port, () => {
    console.log(`⚡️[Demo Credit API]: Server is running at ${port}`);
});