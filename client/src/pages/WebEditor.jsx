import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios";
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from "lucide-react";
import {motion } from "motion/react";
import { AnimatePresence } from 'motion/react';
import Editor from '@monaco-editor/react';

function WebEditor() {
  const [web, setWeb] = useState(null)
  const [error, setError] = useState(null)
  const [showCode, setShowCode] = useState(false)
   const [showFullPreview, setShowFullPreview] = useState(false);
  const [code, setCode] = useState("")
  const [message, setMessage] = useState([])
  const [openChat, setOpenChat] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Thinking...")
  const iframeRef = useRef(null)
  const { id } = useParams()

  const ThinkingSteps = [
    "Thinking...",
    "Analyzing your request...",
    "Generating code...",
    "Almost there..."
  ]

  async function handleUpdates(inputPrompt) {
    const typedPrompt = typeof inputPrompt === 'string' ? inputPrompt : prompt
    const trimmedPrompt = typedPrompt.trim()

    if (!trimmedPrompt || loading) return

    setMessage((m) => [...m, { role: 'user', content: trimmedPrompt }, { role: 'Ai', content: '', isLoading: true }])
    setPrompt('')
    setError(null)
    setLoading(true)

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/website/update/${id}`,
        { prompt: trimmedPrompt },
        { withCredentials: true }
      )

      setCode(result.data.code)
      setLoading(false)
      setMessage((prev) => {
        const withoutLoading = prev.filter((msg) => !(msg.role === 'Ai' && msg.isLoading))
        return [...withoutLoading, { role: 'Ai', content: result.data.message }]
      })
    } catch (error) {
      console.log(error)
      setLoading(false)
      setMessage((prev) => prev.filter((msg) => !(msg.role === 'Ai' && msg.isLoading)))
      setError(error.response?.data?.message || 'Failed to update website')
    }
  }

  useEffect(() => {
    if (!loading) {
      setLoadingText("Thinking...")
      return
    }

    let stepIndex = 0
    setLoadingText(ThinkingSteps[0])

    const interval = setInterval(() => {
      stepIndex += 1
      setLoadingText(ThinkingSteps[stepIndex % ThinkingSteps.length])
    }, 12000)

    return () => clearInterval(interval)
  }, [loading])
  useEffect(() => {
    const getWebsite = async () => {
      try {
        const website = await axios.get(`${import.meta.env.VITE_SERVER_URL}/website/get/${id}`, { withCredentials: true })
        setWeb(website.data)
        setCode(website.data.latestCode)
        setMessage(website.data.conversation)
        console.log(website)
      }
      catch (error) {
        console.log(error)
        setError(error.response.data.message)
      }
    }
    getWebsite();
  }, [id])

  useEffect(() => {
    if (!iframeRef.current || !code) {
      return
    }
    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    iframeRef.current.src = url
    return () => URL.revokeObjectURL(url)
  }, [code])

  if (error) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-black
    text-red-400'>
        <p>{error}</p>
      </div>
    )
  }
  if (!web) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-black'>
        <p>Loading...</p>
      </div>
    )
  }
  return (
    <div className='w-screen h-screen flex bg-black text-white overflow-hidden'>
      <aside className=' w-[min(20rem,38vw)] min-w-64 h-full shrink-0 flex flex-col border-r border-white/10 bg-zinc-950'>
        <Header  onclose={() => setOpenChat(false)} />
        <div className='min-h-0 flex-1 flex flex-col'>
          <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4'>
            {message.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}>
                <div className={`px-4 py-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-800 text-white"}`}>
                  {msg.isLoading ? (
                    <div className="max-w-[85%]">
                    <span className='px-4 py-2.5 rounded-2xl text-xs
                    bg-white border border-white/10 text-zinc-400 italic'>{loadingText || 'Thinking...'}</span>
                    </div>
                   
                  ) : (
                    msg.content
                  )}
                </div>

              </div>
            ))}
          </div>
          <div className='shrink-0 border-t border-white/10 bg-zinc-950 p-3'>
            <div className='flex items-end gap-2'>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdates(prompt)
                  }
                }}
                placeholder='Describe changes...'
                className='min-w-0 flex-1 resize-none rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white outline-none placeholder:text-zinc-500 
              focus:border-indigo-400 focus:ring-1 
              focus:ring-indigo-400' />
              <button
                onClick={() => handleUpdates(prompt)}
                aria-label='Send message'
                disabled={loading}
                className={`shrink-0 rounded-xl p-3 transition ${loading ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}`}>
                <Send size={14} />
              </button>

            </div>
          </div>
        </div>
      </aside>
      <main className='min-w-0 min-h-0 flex-1 flex flex-col'>
        <div className='h-14 w-full shrink-0 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
          <span className='text-xs text-zinc-400'>Live preview</span>
          <div className='flex gap-2'>
            <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold transition hover:scale-105'>
              <Rocket size={14} />Deploy
            </button>
             <button className='p-2 lg:hidden' onClick={()=>setOpenChat(true)}><MessageSquare size={18} /></button>
            <button
              onClick={() => setShowCode(true)}
              className='p-2 rounded-lg hover:bg-white/10 transition'
              aria-label='View code'
            >
             
              <Code2 size={18} />
            </button>
            <button onClick={()=>setShowFullPreview(true)}
            className='p-2 rounded-lg hover:bg-white/10 transition' aria-label='Open full preview'>
              <Monitor size={18} />
            </button>
          </div>

        </div>
        <iframe title='Website preview' ref={iframeRef} className='min-h-0 flex-1 w-full border-0 bg-white'></iframe>
      </main>
      <AnimatePresence>
        {openChat && (
          <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: "0%" }}
          exit={{ opacity: 0, x: "100%" }}
          className='fixed inset-0 z-[9999] bg-black/80 flex flex-col'>
            <Header onclose={() => setOpenChat(false)} />
            <div className='min-h-0 flex-1 flex flex-col'>
          <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4'>
            {message.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}>
                <div className={`px-4 py-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-800 text-white"}`}>
                  {msg.isLoading ? (
                    <div className="max-w-[85%]">
                    <span className='px-4 py-2.5 rounded-2xl text-xs
                    bg-white border border-white/10 text-zinc-400 italic'>{loadingText || 'Thinking...'}</span>
                    </div>
                   
                  ) : (
                    msg.content
                  )}
                </div>

              </div>
            ))}
          </div>
          <div className='shrink-0 border-t border-white/10 bg-zinc-950 p-3'>
            <div className='flex items-end gap-2'>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdates(prompt)
                  }
                }}
                placeholder='Describe changes...'
                className='min-w-0 flex-1 resize-none rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white outline-none placeholder:text-zinc-500 
              focus:border-indigo-400 focus:ring-1 
              focus:ring-indigo-400' />
              <button
                onClick={() => handleUpdates(prompt)}
                aria-label='Send message'
                disabled={loading}
                className={`shrink-0 rounded-xl p-3 transition ${loading ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}`}>
                <Send size={14} />
              </button>

            </div>
          </div>
        </div>

          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCode && (
          <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: "0%" }}
          exit={{ opacity: 0, x: "100%" }}
          className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e]
          flex flex-col'>
            <div className='h-12 shrink-0 px-4 flex justify-between items-center border-b
            border-white/10 bg-[#1e1e1e]'>
              <span className='text-sm font-medium'>index.html</span>
              <button
                onClick={() => setShowCode(false)}
                className='p-2 rounded-lg hover:bg-white/10 transition'
                aria-label='Close code panel'
              >
                <X size={18} />
              </button>
            </div>
            <div className='min-h-0 flex-1'>
              <Editor
                height='100%'
                theme='vs-dark'
                value={code}
                language='html'
                options={{
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
                onMount={(editor) => {
                  editor.getAction('editor.action.formatDocument')?.run();
                }}
                onChange={(value) => setCode(value || '')}
              />
            </div>


          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFullPreview && (
          <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: "0%" }}
          exit={{ opacity: 0, x: "100%" }}
          className='fixed inset-0 z-[9999] bg-black'>
            <button
              onClick={() => setShowFullPreview(false)}
              className='absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/70 text-white hover:bg-black transition'
              aria-label='Close full preview'
            >
              <X size={20} />
            </button>
            <iframe title='Full website preview' className='w-full h-full border-0 bg-white' srcDoc={code} />

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
  function Header({onclose}) {
    return (

      <div className='h-14 shrink-0 px-4 flex items-center justify-between border-b border-white/10'>
        <span className='font-bold truncate'>{web.title}</span>
        {onclose && ( <button className='lg:hidden' onClick={()=>setOpenChat(false)}>

          <X size={18} />
      </button>  )}
    
      </div>

    )
  }

}


export default WebEditor;
