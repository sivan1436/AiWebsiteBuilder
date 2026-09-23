import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import dns from "dns";
import authRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/userRoutes.js";
import webRouter from "./Routes/websiteRoutes.js";
import BillingRouter from "./Routes/BillingRoutes.js";
import { WebHook } from "./controlers/WebhookControler.js";



dns.setServers(["8.8.8.8","8.8.4.4"]);


const app = express();
app.post("/billing/webhook", express.raw({ type: "application/json" }), WebHook);
dotenv.config();
connectDB();

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORSE_ORIGIN,
    credentials: true
}));
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/website",webRouter);
app.use("/billing",BillingRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
