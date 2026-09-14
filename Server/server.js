import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import dns from "dns";

dns.setServers(["8.8.8.8","8.8.4.4"]);


const app = express();
dotenv.config();
connectDB();

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});