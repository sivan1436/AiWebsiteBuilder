import express from "express";
import  isAuth  from "../middlewares/isAuth.js";
import { BillingController } from "../controlers/BillingControler.js";
const BillingRouter = express.Router();

BillingRouter.post("/",isAuth,BillingController)

export default BillingRouter;