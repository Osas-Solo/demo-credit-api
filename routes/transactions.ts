import express, {Router} from "express";
import {deposit} from "../api/transactions";

const router: Router = express.Router();

router.post("/deposit", deposit);

module.exports = router;