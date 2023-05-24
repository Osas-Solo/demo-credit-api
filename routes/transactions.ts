import express, {Router} from "express";
import {deposit, withdraw} from "../api/transactions";

const router: Router = express.Router();

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

module.exports = router;