import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios";
import { Code2, Monitor, Rocket, Send } from "lucide-react";

function Editor() {
  const [web, setWeb] = useState(null)
  const [error, setError] = useState(null)
  const [code, setCode] = useState("")
  const [message, setMessage] = useState([])
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
    <div className='w-screen h-screen flex bg-[#f5f5f5] text-zinc-900 overflow-hidden'>
      <aside className='w-[min(22rem,38vw)] min-w-[18rem] h-full shrink-0 flex flex-col border-r border-zinc-200 bg-[#f5f5f5]'>
        <Header />
        <div className='min-h-0 flex-1 flex flex-col bg-[#f5f5f5]'>
          <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f5f5f5]'>
            {message.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-6 shadow-sm ${msg.role === "user"
                  ? "bg-[#111111] text-white rounded-br-md"
                  : "bg-white text-zinc-800 border border-zinc-200 rounded-bl-md"}`}>
                  {msg.isLoading ? (
                    <span className='inline-block text-xs font-medium tracking-wide text-zinc-500'>{loadingText || 'Thinking...'}</span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className='shrink-0 border-t border-zinc-200 bg-[#f5f5f5] p-3'>
            <div className='flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 py-2 shadow-sm'>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdates(prompt)
                  }
                }}
                placeholder='Describe changes...'
                className='min-w-0 flex-1 bg-transparent border-0 text-sm text-zinc-900 outline-none placeholder:text-zinc-500'
              />
              <button
                onClick={() => handleUpdates(prompt)}
                aria-label='Send message'
                disabled={loading}
                className={`shrink-0 rounded-xl p-2.5 transition ${loading ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-zinc-700'}`}>
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
            <button className='p-2'><Code2 size={18} /></button>
            <button className='p-2'><Monitor size={18} /></button>
          </div>

        </div>
        <iframe title='Website preview' ref={iframeRef} className='min-h-0 flex-1 w-full border-0 bg-white'></iframe>
      </main>
    </div>
  )
  function Header() {
    return (

      <div className='h-14 shrink-0 px-4 flex items-center justify-between border-b border-white/10'>
        <span className='font-bold truncate'>{web.title}</span>

      </div>

    )
  }

}


export default Editor
