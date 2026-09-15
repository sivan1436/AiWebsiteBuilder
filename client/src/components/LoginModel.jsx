import React from 'react'
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import {AnimatePresence, motion} from "motion/react"
import {X} from "lucide-react"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';



function LoginModel({open,onClose}) {
  const dispatch = useDispatch();
  async function handleGoogleLogin(){
    try{
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const {data} =await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`,{
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL
      },{withCredentials:true});
      dispatch(setUserData(data.user));
      onClose();
    }
    catch(error){
      console.error(error);
    }
  }
  return (
    <AnimatePresence>
    {open && (
       <motion.div
       onClick={(event)=>{
         if (event.target === event.currentTarget) onClose()
       }}
       initial={{opacity:0}}
       animate={{opacity:1}}
       exit={{opacity:0}}
       className='fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4'>
    <motion.div
    onClick={(event)=>event.stopPropagation()}
       initial={{scale:0.8,opacity:0,y:40}}
       animate={{scale:1,opacity:1,y:0}}
       exit={{scale:0.8,opacity:0,y:40}}
       className ='relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br
       from-purple-500/40 via-blue-500/30 to-transparent'>
      
  <div className='relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden'>
    <motion.div
    animate ={{opacity:[0.25,0.5,0.25]}}
    transition={{duration:6,repeat:Infinity}}
    className='absolute -top-32 -left-32 w-80 h-80 bg-purple-500/30
    blur-[140px]' />
    
    <motion.div 
        animate ={{opacity:[0.2,0.4,0.2]}}
    transition={{duration:6,repeat:Infinity,delay:2}}
    className='absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/25
    blur-[140px]'/>


  <button type='button' onClick={(event)=>{ event.stopPropagation(); onClose() }} aria-label='Close login modal' className='absolute top-5 right-5 z-10 text-zinc-400 hover:text-white cursor-pointer'>
   <X size={20} />
  </button>
  <div className='px-8 pb-10 pt-12 text-center relative'>
    <h1
    className='inline-block md-6 px-4 py-1.5 rounded-full bg-white/5
    border border-white/10 text-xs text-zinc-300'>AI powerd website builder</h1>
    <h2 className='text-3xl font-semibold leading-tight
    mb-3 space-x-2'>
    <span>
        Welcome to <span className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>GenWeb.ai</span>
    </span>
    </h2>
   <motion.button
   onClick={handleGoogleLogin}
   whileHover={{scale:1.04}}
   whileTap={{scale:0.96}}
   className='group relative w-full h-13 rounded-xl bg-white
   text-black font-semibold shadow-xl overflow-hidden'>
   <div className='relative flex items-center justify-center gap-1'>
   <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
   alt="" 
   className='w-6 h-6 mr-2'/>
   continue with google
   </div>

   </motion.button>
   <div className='flex items-center gap-4 my-10'>
    <div className='flex-1 h-px bg-white/10'/>
      <span className='text-xs text-zinc-500 tracking-wide'>Secure Login</span>
    <div className='flex-1 h-px bg-white/10'/>
   </div>
   <p className='text-xs text-zinc-500 leading-relaxed'>
    By continueing you agree to our <span className='underline cursor-pointer hover:text-zinc-300'>Terms of Service</span> and <span className='underline cursor-pointer hover:text-zinc-300'>
      Privacy Policy
      </span>
   </p>
  </div>
   </div>
 

    </motion.div>
   
   
   
    </motion.div> 
    )}
  </AnimatePresence>
  )
}

export default LoginModel
