import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OtherUsers from './OtherUsers'
import ChatHeading from './ChatHeading'
import Messages from './Messages'
import SendMessage from './SendMessage'
import MainHeading from './MainHeading'
import { Navigate } from 'react-router-dom'
import { setSlideRightSide } from '../../redux/messageSlice'
import axios from 'axios'

const Home = () => {

  const dispatch = useDispatch()
  const { selectedUser } = useSelector(store => store.user)
  const { selectedGroup } = useSelector(store => store.group)
  const { loggedInUser } = useSelector(store => store.user)
  const { slideRightSide } = useSelector(store => store.message)

  useEffect(() => {

    if (slideRightSide == "left-full") {

    } else {
      history.pushState({}, "otherUser")
    }

  }, [slideRightSide])


  useEffect(() => {

    window.onpopstate = function (event) {
      // Do something when the user clicks the back button
      dispatch(setSlideRightSide("left-full"))
    };


  }, [])

  return (
    <div className='w-full h-dvh flex flex-col justify-center items-center gap-1'>
      {!loggedInUser && <Navigate to={"/login"} />}

      {/* MAIN HEADING */}
      <div className='w-full h-[8%] sm:w-[80%] sm:h-[7%] bg-teal-300'><MainHeading /></div>

      <div className='w-full h-full sm:w-[80%] sm:h-[80%] flex gap-1'>

        {/* LEFT SIDE OTHER USERS */}
        <div className='w-full sm:w-[30%] h-full'>

          <OtherUsers />

        </div>

        {/* RIGHT SIDE MESSAGES CHAT */}
        <div className={`fixed top-0 ${slideRightSide} transition-all ease-in-out duration-300 sm:static w-full h-full sm:w-[70%]`}>
          {selectedUser || selectedGroup
            ?
            <div className='w-full h-full flex flex-col'>

              {/* SELECTED USER NAME HEADING IN CHAT */}
              <ChatHeading />

              {/* CONVERSATIONS */}
              <Messages />

              {/* INPUT SEND MESSAGES */}
              <SendMessage />

            </div>
            :
            <div className='w-full h-full border-2 border-solid border-white flex flex-col justify-center items-center gap-5'>

              <img className='w-[80px]' src="https://avatar.iran.liara.run/public/boy" alt="" srcSet="" />

              <p className='bg-slate-700 p-4'>Start Conversation</p>

            </div>}
        </div>

      </div>

    </div>
  )
}

export default Home
