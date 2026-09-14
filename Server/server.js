import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import dns from "dns";
import authRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";


dns.setServers(["8.8.8.8","8.8.4.4"]);


const app = express();
dotenv.config();
connectDB();

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}));
app.use("/api/auth",authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});