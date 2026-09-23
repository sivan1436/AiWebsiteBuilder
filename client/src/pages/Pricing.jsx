import { ArrowLeft, Check, Coins } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';




const plans = [
    {
        key: "free",
        name: "Free",
        price: 0,
        credits: "100",
        description: "Perfect to explore GenWeb.ai",
        features: [
            "AI website generation",
            "Responsive design",
            "Basic animations",

        ],
        popular: false,
        button: "Get Started"
    },
    {
        key: "pro",
        name: "Pro",
        price: "499",
        credits: "1000",
        description: "For professionals who need more",
        features: [
            "Everything in Free",
            "Faster generation",
            "Edit & regenerate",
            "Download Source code",
        ],
        popular: true,
        button: "Upgrade to Pro"
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: "1499",
        credits: "5000",
        description: "For large teams and enterprises",
        features: [
            "Unlimited iterations",
            "High-priority",
            "Team collaboration",
            "Dedicated support",
        ],
        popular: false,
        button: "Contact Sales"
    }

]

function Pricing() {
    const [loding,setLoading] = useState(false)
    const navigate = useNavigate()
    const userData = useSelector((state) => state.user)
    const handleBuy= async (planKey) => {
        if(!userData){
    navigate('/')
    return
        }
        if(planKey === 'free'){
            navigate('/dashboard')
            return
        }
        try{
           const res = await axios.post(import.meta.env.VITE_SERVER_URL + '/billing', {planType:planKey}, {withCredentials:true});
           window.location.href(res.data.sessionUrl)
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <div className='relaive min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16
    pb-24'>
            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute -top-40 -left-40 w-[500px] h-[500px]
            bg-indigo-600/20 rounded-full blur-[120px]'/>
                <div className='absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20
            rounded-full blur-[120px]'/>
            </div>
            <button
                onClick={() => navigate(-1)}
                className='relative z-10 mb-18 flex items-center gap-2 text-sm text-zinc-400
            hover:text-white transition cursor-pointer'>
                <ArrowLeft size={16}
                    className='cursor-pointer' />
                Back
            </button>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative z-10 max-w-4xl 
        mx-auto text-center mb-14'>
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>Simple, transparent pricing</h1>
                <p className='text-zinc-400 text-lg'>Buy credits once. Build anytime.</p>
            </motion.div>
            <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                {plans.map((p, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.12 }}
                        whileHover={{ y: -14, scale: 1.03 }}
                        className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all
            ${p.popular ? 'border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30'
                                : 'border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10'}`}>
                        {p.popular && (
                            <span
                                className='absolute top-5 right-5 px-3 py-1 text-xs
                            rounded-full bg-indigo-500'>Most Popular</span>
                        )}
                        <h3 className='text-xl font-bold mb-2'>{p.name}</h3>
                        <p className='text-zinc-400 text-sm mb-6'>{p.description}</p>
                        <div className='flex items-end gap-1 mb-4'>
                            <span className='text-4xl font-bold'>{p.price}</span>
                            <span className='text-zinc-400'>/one-time</span>
                        </div>
                        <div className='flex items-center gap-2 mb-8'>
                            <Coins size={18} className='text-yellow-400' />
                            <span className='font-semibold' >{p.credits} credits</span>
                        </div>
                        <ul className='space-y-3 mb-10'>
                            {p.features.map((f) => (
                                <li
                                    key={f}
                                    className='flex items-center gap-2 text-sm text-zinc-300
                                   '>
                                    <Check size={16} className='text-green-400' />
                                    {f}
                                </li>
                            ))}


                        </ul>

                    <motion.button
                    whiletap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-xl font-semibold
                        transition ${p.popular ?
                         'bg-indigo-500 hover:bg-indigo-600' 
                         : 'bg-white/10 hover:bg-white/20'}`}>
                        {p.button}
                    </motion.button>
                    



                    </motion.div>
                ))}
            </div>

        </div>
    )
}

export default Pricing
