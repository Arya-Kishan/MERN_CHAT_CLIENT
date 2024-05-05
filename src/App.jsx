import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Protected from './pages/Protected'
import io from "socket.io-client"
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import axios from 'axios'
import { setTypingLoader } from './redux/messageSlice'
export let globalSocket;
import loader from './assets/loader.svg'
import NotFoundPage from './pages/NotFoundPage'

const Login = lazy(() => import('./pages/AuthPage/Login'))
const SignUp = lazy(() => import('./pages/AuthPage/SignUp'))
const Home = lazy(() => import('./pages/Home/Home'))

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

      socket?.on('is-typing', (typingObj) => {
        console.log(typingObj);
        dispatch(setTypingLoader(typingObj))
      });

      return () => socket.close();

    }

  }, [loggedInUser])

  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<div className='w-full h-dvh flex justify-center items-center'><img className='w-[50px]' src={loader} alt="" srcSet="" /></div>}>
          <Routes>
            <Route path='/' element={<Protected><Home /></Protected>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
