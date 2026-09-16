import React from 'react'
import useGetcurrentUser from './hooks/useGetcurrentUser.jsx';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from './pages/Home.jsx'
export const serverUrl = import.meta.env.VITE_SERVER_URL
import { useSelector } from 'react-redux';
import Dashbord from './pages/Dashbord.jsx';
import Generate from './pages/Generate.jsx';
import { Navigate } from 'react-router-dom';
import Editor from './pages/Editor.jsx';




export default function App() {
  useGetcurrentUser();
  const {userData} = useSelector(state => state.user)
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home/>} />

    <Route path="/dashboard" element={userData ? <Dashbord/> : <Home />} />
    <Route path="/generate" element={userData ? <Generate/> : <Home />} />
   <Route path="/editor/:id" element={userData?<Editor /> : <Home />}/>
   </Routes>
   </BrowserRouter>
  )
}

