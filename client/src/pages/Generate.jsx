import React from 'react'
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';
import axios from 'axios';

function Generate() {
  const Navigate = useNavigate();
  const [prompt,setPrompt] = useState("");
  async function handleGenerateWebsite(prompt) {
    try{
      const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/website/generate`,{prompt},{withCredentials:true});
      console.log(result)
    
    }
    catch(err){
      console.log(err)
    }
    
  }
  return (
    <div className='min-h-screen bg-linear-to-r from-[#050505] via-[#0b0b0b] 
    to-[#050505] text-white'>
            <div className='sticky top-0 z-40 backdrop-blur-xl 
      bg-black/50 border-b border-white/10'>               
        <div className='max-w-7xl mx-auto px-6 h-16 
        flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <button className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition'>
              <ArrowLeft size={20} onClick={() => Navigate(-1)} />
            </button>
            <h1 className='text-lg font-semibold'>Genweb
              <span className='text-zinc-400'>.ai</span></h1>

          </div>
        </div>
      </div>
      <div className='max-w-6xl mx-auto px-6 py-16'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-10 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
            build websites with
            <span className='block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
              Real Ai Power
            </span>
          </h1>
           <p className='text-zinc-400 max-w-2xl mx-auto'>this procee may take several minites Genweb.ai focuses on quality,not shortcuts</p>

        </motion.div>
        <div className='mb-14'>
          <h1 className='text-xl font-semibold mb-2'>Descibe your website</h1>
        <div className='relative'>
          <textarea
          onChange={(e)=>{setPrompt(e.target.value)}}
          placeholder='Describe your website in detail...'
          className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none text-sm leading-relaxed
          focus:ring-2 focus:ring-white/20'>


          </textarea>

        </div>
        </div>
        <div className='flex justify-center'>
        <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{scale:0.96}}
        onClick={() => handleGenerateWebsite(prompt)}
        className='px-14 py-4 rounded-2xl font-semibold text-lg bg-white text-black'>
         Generate website

        </motion.button>
        </div>
      </div>
    </div>
  )
}

export default Generate
