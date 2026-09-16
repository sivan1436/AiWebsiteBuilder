import express from "express";
import  isAuth  from "../middlewares/isAuth.js";
import { Changes, GenerateWebSite,getAllWeb,getWebsiteById } from "../controlers/websiteControler.js";


const webRouter = express.Router();

webRouter.post("/generate",isAuth,GenerateWebSite);
webRouter.get("/get/:id",isAuth,getWebsiteById);
webRouter.post("/update/:id",isAuth,Changes)
webRouter.get("/get",isAuth,getAllWeb)

export default webRouter;