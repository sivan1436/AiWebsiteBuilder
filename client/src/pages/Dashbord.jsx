import { ArrowLeft, Check, Rocket, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';





function Dashbord() {
  const { userData } = useSelector(state => state.user);
  const Navigate = useNavigate();
  const [websites, setWebsites] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copidUrl, setCopiedUrl] = useState(null);

  async function handleDeploy(id) {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/website/deploy/${id}`,
        {},
        { withCredentials: true }
      );
      window.open(result.data.Url, '_blank');
    }
    catch (err) {
      console.error('Error deploying website:', err);
    }
  }

  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/website/get`, { withCredentials: true });
        setWebsites(result.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching websites:', error);
        setError(error.response?.data?.message || 'Failed to fetch websites');
        setLoading(false);
      }
    };
    handleGetAllWebsites();
  }, [userData, Navigate]);
  async function handleCopyLink(id) {
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/website/get/${id}`, { withCredentials: true });
      const deployUrl = result.data?.deployUrl;

      if (!deployUrl) {
        throw new Error('This website does not have a deployment link yet.');
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(deployUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = deployUrl;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('copy');
        input.remove();
      }

      setCopiedUrl(id);
      setTimeout(() => { setCopiedUrl(null) }, 2000);
    } catch (error) {
      console.error('Error copying website link:', error);
      setError(error.response?.data?.message || error.message || 'Failed to copy website link');
    }
  }

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
        {loading && (
          <div className='text-zinc-400 mt-24 text-center'>
            Loading your websites...
          </div>
        )}
        {error && !loading && (
          <div className='text-red-500 mt-24 text-center'>
            {error}
          </div>
        )}
        {websites?.length === 0 && (
          <div className='mt-24 text-center text-zinc-400'> You have no websites.</div>
        )}
        {!loading && !error && websites?.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2
          xl:grid-cols-3 gap-8'>
            {websites.map((web, index) => {
              const copied = copidUrl === web._id
              return <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={()=>Navigate(`/editor/${web._id}`)}
                className='rounded-2xl bg-white/5 
              border border-white/10 overflow-hidden 
              hover:bg-white/10 transition 
               flex flex-col'>
                <div onClick={() => Navigate(`/editor/${web._id}`)}
                  className='relative h-[160px] overflow-hidden bg-black cursor-pointer'>
                  <iframe
                    title={`${web.title || 'Website'} preview`}
                    srcDoc={web.latestCode || ''}
                    className='absolute inset-0 h-[140%] w-[140%] origin-top-left scale-[0.72] pointer-events-none bg-white'
                  />
                  <div className='absolute inset-0 bg-black/30' />

                </div>
                <div className='p-5 flex flex-col gap-4 flex-1'>
                  <h3 className='text-base font-semibold line-clamp-2'>{web.title || 'Website'}</h3>
                  <p className='text-xs text-zinc-400'>
                    Last Update : {""}
                    {new Date(web.updatedAt).toLocaleDateString()}
                  </p>
                  {!web.deployed ? (<button
                    onClick={() => handleDeploy(web._id)}
                    className='mt-auto flex items-center justify-center gap-2
                px-4 py-2 rounded-xl  text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 trandition'>
                    <Rocket size={18} />Deploy</button>) : (<motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopyLink(web._id)}
                      className={`mt-auto flex items-center justify-center gap-2
                px-4 py-2 rounded-xl  text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 
                hover:scale-105 trandition ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 hover:bg-white/20 border border-white/20"}`}>
                      {copied?(
                        <>
                        <Check size={18} />
                        Link Copied
                        </>
                      )
                      :
                      <>
                      <Share2 size={18}/>
                      Share Link
                      </>
                      }
                    </motion.button>)}

                </div>
              </motion.div>
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashbord;
