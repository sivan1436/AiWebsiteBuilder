import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controlers/userControler.js";   
import { GenerateWebSite } from "../controlers/userControler.js";




const userRouter = express.Router();

userRouter.get("/me",isAuth,getCurrentUser);
userRouter.get("/gen",GenerateWebSite);


export default userRouter;