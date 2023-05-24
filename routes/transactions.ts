import express, {Router} from "express";
import {deposit, transfer, withdraw} from "../api/transactions";

const router: Router = express.Router();

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer/:accountNumber", transfer);

module.exports = router;