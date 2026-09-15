import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { googleAuth,logOut } from "../controlers/auth.controler.js";   


const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.get("/logout",logOut);



export default authRouter;