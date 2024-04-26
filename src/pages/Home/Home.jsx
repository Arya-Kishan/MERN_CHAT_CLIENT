import React from 'react'
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import OtherUsers from './OtherUsers'
import ChatHeading from './ChatHeading'
import Messages from './Messages'
import SendMessage from './SendMessage'

const otherUsers = [{ name: "Nidhi" }, { name: "Vishwa" }, { name: "Anand" }]

const Home = () => {

  const dispatch = useDispatch()
  const { selectedUser } = useSelector(store => store.user)

  return (
    <div className='w-full h-dvh flex justify-center items-center'>

      <div className='w-[80%] h-[80%] flex gap-1'>

        {/* LEFT SIDE OTHER USERS */}
        <div className='w-[30%] h-full border-2 border-solid border-white'>

          <h1 className='text-2xl p-2'>CHAT APP</h1>

          <OtherUsers />

        </div>

        {/* RIGHT SIDE MESSAGES CHAT */}
        {selectedUser ? <div className='w-[70%] h-full border-2 border-solid border-white flex flex-col'>

          {/* SELECTED USER NAME HEADING IN CHAT */}
          <ChatHeading />

          {/* CONVERSATIONS */}
          <Messages />

          {/* INPUT SEND MESSAGES */}
          <SendMessage />

        </div> : <div className='w-[70%] h-full border-2 border-solid border-white flex flex-col justify-center items-center gap-5'>

          <img className='w-[80px]' src="https://avatar.iran.liara.run/public/boy" alt="" srcSet="" />

          <p className='bg-slate-700 p-4'>Start Conversation</p>

          </div>}

      </div>

    </div>
  )
}

export default Home
