import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios";
import { Code2, Monitor, Rocket,Send } from "lucide-react";

function Editor() {
  const [web, setWeb] = useState(null)
  const [error, setError] = useState(null)
  const [code,setCode] = useState("")
  const [message,setMessage] = useState([])
  const [prompt,setPrompt] = useState("")
  const iframeRef = useRef(null)
  const { id } = useParams()
 
  async function handleUpdates(prompt) {
    setMessage((m)=>[...m,{role:"user",content:prompt}])
    try{
    const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/website/update/${id}`, { prompt }, { withCredentials: true })
    console.log(result) 
    setCode(result.data.code)
    setMessage(prev => [...prev, { role: "Ai", content: result.data.message }])
  }
    catch(error){
      console.log(error)

    }
    
  }


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
        <Header />
        <Chat />
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
  function Chat() {
    return (
      <div className='min-h-0 flex-1 flex flex-col'>
        <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4'>
        {message.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}>
            <div className={`px-4 py-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-800 text-white"}`}>
              {msg.content}
            </div>

          </div>
        ))}
        </div>
        <div className='shrink-0 border-t border-white/10 bg-zinc-950 p-3'>
          <div className='flex items-end gap-2'>
            <textarea rows={1}
            onChange={(e)=>{setPrompt(e.target.value)}}
            placeholder='Describe changes...'
              className='min-w-0 flex-1 resize-none rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400'></textarea>
            <button
            onClick={handleUpdates} 
            aria-label='Send message' className='shrink-0 rounded-xl bg-white p-3 text-black transition hover:bg-zinc-200'>
              <Send size={14}  />
            </button>

          </div>
        </div>
      </div>

    )
  }
}


export default Editor
