import express from "express";
import  isAuth  from "../middlewares/isAuth.js";
import { Changes, GenerateWebSite,getAllWeb,getWebsiteById,getLiveWebsite } from "../controlers/websiteControler.js";
import {DeployWebsite} from "../controlers/websiteControler.js";

const webRouter = express.Router();

webRouter.post("/generate",isAuth,GenerateWebSite);
webRouter.get("/get/:id",isAuth,getWebsiteById);
webRouter.post("/update/:id",isAuth,Changes)
webRouter.get("/get",isAuth,getAllWeb)
webRouter.post("/deploy/:id",isAuth,DeployWebsite)
webRouter.get("/site/:slug", getLiveWebsite)

export default webRouter;