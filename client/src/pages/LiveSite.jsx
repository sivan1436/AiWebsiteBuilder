import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function LiveSite() {
  const {id} = useParams();
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  useEffect(()=>{
    async function handleGetLiveSite(){
      try{
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/website/site/${id}`);
        setHtml(result.data.latestCode);
      }
      catch(err){
        setError(err.response?.data?.message || 'site not found');
      }
    }
    handleGetLiveSite();
  },[id])

  if(error){
    return (
      <div className='min-h-screen flex items-center justify-center text-white bg-black'>
        {error}
        
      </div>
    )
  }
  return (
    <div>
      <iframe title='Live Site' srcDoc={html} className='w-full h-screen border-none' sandbox='allow-scripts allow-same-origin allow-forms' />
    </div>
  )
}

export default LiveSite;
