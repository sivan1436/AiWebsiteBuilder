import React from 'react'
import useGetcurrentUser from './hooks/useGetcurrentUser.jsx';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from './pages/Home.jsx'
export const serverUrl = import.meta.env.VITE_SERVER_URL
export default function App() {
  useGetcurrentUser();
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home/>} />
   </Routes>
   </BrowserRouter>
  )
}

