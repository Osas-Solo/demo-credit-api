import express, {Request, Response, Router} from "express";
import {getAllCustomers, signup} from "../api/customers";

const router: Router = express.Router();

router.post("/", signup);
router.get("/", getAllCustomers);

module.exports = router;