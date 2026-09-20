import React from 'react'
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function Generate() {
  const Navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const PHASES = ["Analyzing your idea",
    "Designing layout & structure",
    "Writing HTML & CSS...",
    "Adding animation & interactions...",
    "Final quality checks...",
  ]

  async function handleGenerateWebsite(prompt) {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || loading) return;

    setLoading(true);
    setError("");
    try {
      const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/website/generate`, { prompt: trimmedPrompt }, { withCredentials: true });
      setProgress(100);
      Navigate(`/editor/${result.data.websiteId}`);
    }
    catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }

  }
  useEffect(() => {
    if (!loading) {
      setPhaseIndex(0);
      setProgress(0);
      return;
    }
    let value = 0;
    let phase = 0;
    const interval = setInterval(() => {
      const increment = value < 20 ? Math.random() * 1.5 :
        value < 60 ? Math.random() * 1.2
          : Math.random() * 0.6;
      value += increment;
      if (value >= 93) value = 93;

      phase = Math.min(
        Math.floor((value / 100) * PHASES.length), PHASES.length - 1


      );
      setProgress(Math.floor(value));
      setPhaseIndex(phase);

    }, 1200)
    // Random increment between 0 and 5
    return () => clearInterval(interval);

  }, [loading]);

  return (
    <div className='min-h-screen bg-linear-to-r from-[#050505] via-[#0b0b0b] 
    to-[#050505] text-white'>
      <div className='sticky top-0 z-40 backdrop-blur-xl 
      bg-black/50 border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-6 h-16 
        flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <button onClick={() => Navigate(-1)} className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition' aria-label='Go back'>
              <ArrowLeft size={20} />
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
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value) }}
              placeholder='Describe your website in detail...'
              className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none text-sm leading-relaxed
          focus:ring-2 focus:ring-white/20'>


            </textarea>

          </div>
        {error && (
          <div className='text-red-500 mt-2 text-sm'>
            {error}
          </div>
        )}

        </div>
        <div className='flex justify-center'>
          <motion.button
            disabled={loading || !prompt.trim()}
            whileHover={loading || !prompt.trim() ? undefined : { scale: 1.05 }}
            whileTap={loading || !prompt.trim() ? undefined : { scale: 0.96 }}
            onClick={() => handleGenerateWebsite(prompt)}
            className={`px-14 py-4 rounded-2xl font-semibold text-lg transition ${loading || !prompt.trim()
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              : 'bg-white text-black hover:bg-zinc-200'}`}>
            {loading ? 'Generating...' : 'Generate website'}

          </motion.button>
        </div>
       {loading && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='max-w-xl mx-auto mt-12'>
          <div className='flex justify-between mb-2 text-xs text-zinc-400'>
            <span className='font-semibold'>{PHASES[phaseIndex]}
            </span>
            <span className=''>{progress}%</span>
          </div>
          <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>
          <motion.div
          className='h-full bg-linear-to-r from-white to-zinc-300'
          animate={{ width: `${progress}%` }}
          transition={{ease: "easeInOut", duration: 0.5 }}
          />

          </div>
          <div className='text-center text-xs text-zinc-400 mt-4'>
            Estimated time remaining:{" "} 
            <span className='text-white font-medium'>
             ~8-12 minutes
            </span>

          </div>
        </motion.div>
       )}
      </div>
    </div>
  )
}

export default Generate
