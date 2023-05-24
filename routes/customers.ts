import express, {Router} from "express";
import {getAllCustomers, getCustomer, signup} from "../api/customers";

const router: Router = express.Router();

router.post("/", signup);
router.get("/", getAllCustomers);
router.get("/:accountNumber", getCustomer);

module.exports = router;