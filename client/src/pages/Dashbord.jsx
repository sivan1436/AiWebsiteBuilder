import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';




function Dashbord() {
  const { userData } = useSelector(state => state.user);
  const Navigate = useNavigate();

  return (
    <div className='min-h-screen  bg-black text-white'>
      <div className='sticky top-0 z-40 backdrop-blur-xl 
      bg-black/50 border-b border-white/10'>               
        <div className='max-w-7xl mx-auto px-6 h-16 
        flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <button className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition'>
              <ArrowLeft size={20} onClick={() => Navigate(-1)} />
            </button>
            <h1 className='text-lg font-semibold'>Dashboard</h1>

          </div>

          <button onClick={() => Navigate('/generate')}
           className='px-4 py-2 rounded-lg border bg-white text-black
 hover:scale-105 transition'>+ New Website

          </button>
        </div>

      </div>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-10'>
          <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
          <h1 className='text-3xl font-bold truncate'>
            {userData?.name || 'User'}
          </h1>
        </motion.div>

      </div>
    </div>
  )
}

export default Dashbord;
