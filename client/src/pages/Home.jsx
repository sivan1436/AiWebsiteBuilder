import React from 'react'
import {motion} from "motion/react"

function Home() {
    const highlights =["AI Generated Code",
        "Fully Responsive Layouts",
        "Production Ready Websites"
    ]
  return (
    <div className ="relative min-h-screen bg-[#040404] text-white
    overflow-hidden">
    <motion.div initial={{y:-40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.5}}
    className='flex w-full top-0 left-0 right-0 z-50 background-blur-xl bg-black/40
     border-b border-white/10'>
     <div className='w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
       <div className="text-lg font-semibold ">
        Genweb.ai
        </div> 
        <div className="flex items-center gap-5">
        <div className='hidden md:inline text-sm 
        text-zinc-400 hover:text-white cursor-pointer'>
          Pricing
        </div>
        <button className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10
        text-sm'>
            Get Started
        </button>
         
        </div>  
      </div>
     </motion.div>
     <section className='pt-44 pb-12 px-6 text-center'>
    <motion.h1
    initial={{y:40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:1,delay:0.2}}
    className ='text-5xl md:tex-7xl font-bold tracting-tight'>
      Build stunning websites <br/> <span
      className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>with AI</span>
    </motion.h1>
    <motion.p
    initial={{y:40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:1,delay:0.4}}
    className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'>
       Describe your idea and let AI generate a modern,responsive,production-ready website for you. 
    </motion.p>
    <motion.div
    initial={{y:40,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:1,delay:0.6}}
    className='mt-8 flex justify-center gap-4'>
        <button className='px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition'>
            Get started
        </button>
    </motion.div>
     </section>
     <section className='max-w-7xl mx-auto px-6 py-32'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {highlights.map((h,index)=>(
           <motion.div
           key={index}
           initial={{y:40,opacity:0}}
           whileInView={{y:0,opacity:1}}
           transition={{duration:0.5,delay:index*0.2}}
           className='rounded-2xl bg-white/5  border border-white/10 p-8'>
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
    </div>
  )
}

export default Home
