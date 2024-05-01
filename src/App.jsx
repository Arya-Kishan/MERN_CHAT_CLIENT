import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home/Home'
import Login from './pages/AuthPage/Login'
import SignUp from './pages/AuthPage/SignUp'
import { useSelector, useDispatch } from "react-redux"
import Protected from './pages/Protected'
import io from "socket.io-client"
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import axios from 'axios'
export let globalSocket;

const App = () => {

  axios.defaults.baseURL = ("https://mern-chat-server-mbzu.onrender.com/api/v1")
  const baseUrl = "https://mern-chat-server-mbzu.onrender.com"

  // axios.defaults.baseURL = ("http://localhost:8080/api/v1")
  // const baseUrl = "http://localhost:8080"

  const { loggedInUser } = useSelector(store => store.user)
  const { messages } = useSelector(store => store.message)
  const dispatch = useDispatch()

  useEffect(() => {

    if (loggedInUser) {
      const socket = io(baseUrl, {
        query: {
          userId: loggedInUser._id,
        }
      });

      globalSocket = socket;

      // dispatch(setSocket(socket))

      socket?.on('onlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      });

      return () => socket.close();

    }

  }, [loggedInUser])

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Protected><Home /></Protected>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
