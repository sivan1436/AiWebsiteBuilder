import cashfreeClient from "../config/Cashfree.js";
import { PLANS } from "../config/Plan.js";



export async function BillingController(req,res) {
  try{
  const { planType } = req.body;
  const userId = req.user.id;
  const plan = PLANS[planType];
  if (!plan || plan.price ==0) {
return res.status(400).json({ message: "Invalid plan type or free plan selected." });
  } 
  const session = await cashfreeClient.createPaymentSession({
    orderId: `genweb_${userId}_${Date.now()}`,
    orderAmount: plan.price,
    customerId: String(userId),
    customerEmail: req.user.email,
    customerPhone: "9999999999",
    returnUrl: `${process.env.VITE_DEPLOY_URL}/pricing?payment=success`,
    notifyUrl: `${process.env.SERVER_URL || "http://localhost:4000"}/billing/webhook`,
    orderTags: {
      userId: String(userId),
      credits: String(plan.credits),
      plan: plan.plan,
    },
  });

 return res.status(200).json({ paymentSessionId: session.payment_session_id });
}
  catch(err){
return res.status(500).json({ message: `billing error : ${err.message}`, error: err.message });
  } 
}