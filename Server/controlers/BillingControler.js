import cashfreeClient from "../config/Cashfree.js";
import { PLANS } from "../config/plans.js";



export async function BillingController(req,res) {
  try{
  const { planType } = req.body;
  const userId = req.user.id;
  const plan = PLANS[planType];
  if (!plan || plan.price ==0) {
return res.status(400).json({ message: "Invalid plan type or free plan selected." });
  } 
  const session = await cashfreeClient.createPaymentSession({
    mode : "payment",
    payment_method : ["card","upi"],
    line_items : [
        {
            price_data :{
                currency : "INR",
                product_data :{
                    name : `Genweb.ai ${planType.toUpperCase()} plan`
                },
                unit_amount : plan.price * 100,
            },
            quantity : 1
        }
    ],
    metadata : {
        userId : userId,
        credits : plan.credits,
        plan : plan.plan
    },
    success_url : `${process.env.VITE_DEPLOY_URL}/`,
    cancel_url : `${process.env.VITE_DEPLOY_URL}/pricing`
  });

 return res.status(200).json({ sessionUrl: session.url });
}
  catch(err){
return res.status(500).json({ message: `billing error : ${err.message}`, error: err.message });
  } 
}