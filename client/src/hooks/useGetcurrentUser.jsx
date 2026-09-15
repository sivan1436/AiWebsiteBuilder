import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function useGetcurrentUser() {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const getCurrentUser = async()=>{
            try{
                const {data} = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/me`,{withCredentials:true});
                setUser(data.user);
                dispatch(setUserData(data.user));
            }
            catch(error){
                console.error(error);
            }

        }
        getCurrentUser();
        }, [])

        return user;
}

export default useGetcurrentUser
