import dotenv from "dotenv";

dotenv.config();

const cashfreeClient = {
    async createPaymentSession({ orderId, orderAmount, customerId, customerEmail, customerPhone, returnUrl, notifyUrl, orderTags }) {
        const clientId = process.env.CASHFREE_CLIENT_ID;
        const clientSecret = process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_API_KEY;

        if (!clientId || !clientSecret) {
            throw new Error("Cashfree credentials missing. Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET.");
        }

        const response = await fetch(`${process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg"}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-version": "2023-08-01",
                "x-client-id": clientId,
                "x-client-secret": clientSecret,
            },
            body: JSON.stringify({
                order_id: orderId,
                order_amount: orderAmount,
                order_currency: "INR",
                customer_details: {
                    customer_id: customerId,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                },
                order_meta: {
                    return_url: returnUrl,
                    notify_url: notifyUrl,
                },
                order_tags: orderTags,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Cashfree order creation failed");
        }

        return data;
    },
};

export default cashfreeClient;
