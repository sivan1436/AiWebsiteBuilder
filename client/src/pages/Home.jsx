import React from 'react'
import { useEffect, useState } from 'react'
import {AnimatePresence, motion} from "motion/react"
import LoginModel from '../components/LoginModel.jsx'
import { useSelector } from 'react-redux'
import { Coins, CoinsIcon } from 'lucide-react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';



function Home() {
    const highlights =["AI Generated Code",
        "Fully Responsive Layouts",
        "Production Ready Websites"
    ]
    const {userData} = useSelector(state=>state.user)
    const [openLogin,setOpenLogin] = useState(false)
    const [avatarError, setAvatarError] = useState(false)
   const [openProfile,setOpenProfile] = useState(false)
   const dispatch = useDispatch();



    useEffect(() => {
      setAvatarError(false)
    }, [userData?.avatar])

    const userInitial = userData?.name?.charAt(0)?.toUpperCase() || 'U'
  async function handleLogout(){
    try{
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,{withCredentials:true});
      dispatch(setUserData(null));
      setOpenProfile(false);
    }
     catch(error){
    console.error(error);
  }
  }
 
  
    return (
    <div className ="relative min-h-screen overflow-hidden bg-[#040404] text-white">
    <motion.div initial={{y:-40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.5}}
    className='fixed top-0 left-0 right-0 z-50 flex w-full border-b border-white/10 bg-black/60 backdrop-blur-xl'>
     <div className='w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
       <div className="text-lg font-semibold tracking-tight">
        Genweb.ai
        </div> 
        <div className="flex items-center gap-5">
        <div className='hidden md:inline text-sm 
        text-zinc-400 hover:text-white cursor-pointer'>
          Pricing
        </div>
        {userData && 
        <div className='flex items-center gap-2 text-sm rounded-full px-3 py-1.5 bg-white/5 border border-white/10
        hover:bg-white/10 cursor-pointer transition' >
         <CoinsIcon size={20} className='hidden md:flex inline-block mr-1 text-yellow-400 ' />
         <span className='text-zinc-300'>credits:<span>{userData.credits}</span> <span className='font-semibold'>+</span></span>
          </div>}
        {!userData ?
                <button onClick={()=>setOpenLogin(true)} className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10
        text-sm'>
            Get Started
        </button> 
        :
        <div className='relative'>
        <button 
        onClick={()=>setOpenProfile(!openProfile)}
        type='button' aria-label={`Open ${userData.name || 'user'} profile`} className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white shadow-lg shadow-black/20'>
          {!avatarError && userData.avatar ? (
            <img
              src={userData.avatar}
              alt={`${userData.name || 'User'} avatar`}
              onError={() => setAvatarError(true)}
              className='h-full w-full object-cover'
            />
          ) : userInitial}
        </button>
       <AnimatePresence>
        {openProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10,scale:0.95 }}
            animate={{ opacity: 1, y: 0 ,scale:1 }}
            exit={{ opacity: 0, y: -10 ,scale:0.95 }}
            className='absolute right-0 mt-3 w-60 z-50 rounded-xl bg-black/80 backdrop-blur-lg border border-white/10 shadow-2xl overflow-hidden'
          >
          <div className='px-4 py-3 border-b border-white/10'>
            <p className='text-sm font-medium truncate'>{userData.name || 'User'}</p>
            <p className='text-xs text-zinc-400 truncate'>{userData.email}</p>
          </div>
          <button className='md:hidden w-full px-4 py-3 
          flex items-center gap-2 text-sm border-b border-white/10
          hover:bg-white/5 transition'>
          <CoinsIcon size={20} className='inline-block mr-1 text-yellow-400 ' />
         <span className='text-zinc-300'>credits:<span>{userData.credits}</span> <span className='font-semibold'>+</span></span>

          </button>
          <button className='w-full px-4 py-3 text-sm text-left border-b border-white/10 hover:bg-white/5 transition'>Dashboard</button>
          <button className='w-full px-4 py-3 text-sm text-left text-red-400 border-b border-white/10 hover:bg-white/5 '
          onClick={handleLogout}
          >Logout</button>
          
          </motion.div>
        )}
       </AnimatePresence>

        </div>
         }    

         
        </div>  
      </div>
     </motion.div>
     <section className='pt-44 pb-12 px-6 text-center'>
    <motion.h1
    initial={{y:40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:1,delay:0.2}}
    className ='text-5xl font-bold tracking-tight md:text-7xl'>
      Build stunning websites <br/> <span
      className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>with AI</span>
    </motion.h1>
    <motion.p
    initial={{y:40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:1,delay:0.4}}
    className='mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400'>
       Describe your idea and let AI generate a modern,responsive,production-ready website for you. 
    </motion.p>
    <motion.div
    initial={{y:40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:1,delay:0.6}}
    className='mt-8 flex justify-center gap-4'>
        <button 
        onClick={()=>setOpenLogin(true)}
        className='rounded-xl bg-white px-10 py-4 font-semibold text-black shadow-[0_12px_40px_rgba(255,255,255,0.12)] transition hover:scale-105 hover:bg-zinc-200'>
            Get started
        </button>
    </motion.div>
     </section>
    <section className='mx-auto max-w-7xl px-6 py-32'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {highlights.map((h,index)=>(
           <motion.div
           key={index}
           initial={{y:40,opacity:0}}
           whileInView={{y:0,opacity:1}}
           transition={{duration:0.5,delay:index*0.2}}
           className='rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]'>
            <h1
            className='text-xl font-semibold mb-3'>{h}</h1>
            <p className='text-zinc-400 text-sm'>
                GenWeb.ai builds real websites-clean code,
                animation,responsiveness and scalable structure.
            </p>
           </motion.div>
          ))}
        </div>

     </section>
     <footer className =' text-center py-10 text-zinc-500 text-sm border-t border-white/10'>
        &copy; {new Date().getFullYear()} GenWeb.ai. All rights reserved.
     </footer>
    {openLogin && <LoginModel open={openLogin} onClose={()=>setOpenLogin(false)} />}
    </div>
  )
}

export default Home
