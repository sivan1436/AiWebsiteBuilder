import crypto from "crypto";
import User from "../models/userModel.js";

export async function WebHook(req,res) {
  try {
    const signature = req.headers["x-webhook-signature"] || req.headers["x-cf-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const secret = process.env.CASHFREE_WEBHOOK_SECRET?.replace(/^"|"$/g, "");
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);

    if (secret && signature && timestamp) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(timestamp + rawBody)
        .digest("base64");

      if (signature !== expectedSignature) {
        return res.status(401).json({ message: "Invalid webhook signature" });
      }
    }

    const event = JSON.parse(rawBody);
    const orderTags = event.data?.order?.order_tags || event.data?.order_tags;
    if (event.type === "PAYMENT_SUCCESS_WEBHOOK" && orderTags?.userId) {
      await User.findByIdAndUpdate(orderTags.userId, {
        $inc: { credits: Number(orderTags.credits) || 0 },
        plan: orderTags.plan,
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook failed:", error);
    return res.status(500).json({ message: "webhook failed" });
  }
}


