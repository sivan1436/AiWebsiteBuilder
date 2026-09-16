import express from "express";
import  isAuth  from "../middlewares/isAuth.js";
import { GenerateWebSite } from "../controlers/websiteControler.js";


const webRouter = express.Router();

webRouter.post("/generate",isAuth,GenerateWebSite);

export default webRouter;