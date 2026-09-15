import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';

function useGetcurrentUser() {
    useEffect(()=>{
        const getCurrentUser = async()=>{
            try{
                const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/me`,{withCredentials:true});
                console.log(result);
            }
            catch(error){
                console.error(error);
            }

        }
        getCurrentUser();
    })
  return (
    <div>
     

    
    </div>
  )
}

export default useGetcurrentUser
