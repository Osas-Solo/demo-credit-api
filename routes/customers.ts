import express, {Request, Response, Router} from "express";
import {signup} from "../api/customers";

const router: Router = express.Router();

router.post("/", signup);

module.exports = router;