import dotenv from "dotenv";
import cashfree from "cashfree-sdk";
dotenv.config();

const cashfreeClient = new cashfree.CashfreeClient({
    apiKey: process.env.CASHFREE_API_KEY,

})

export default cashfreeClient;
