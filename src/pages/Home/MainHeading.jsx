import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedInUser } from '../../redux/userSlice'
import CreateGroup from './CreateGroup'
import { IoLogoSnapchat } from "react-icons/io";

const MainHeading = () => {

    const { loggedInUser } = useSelector(store => store.user)

    const [showProfile, setShowProfile] = useState(false)
    const [showCreateGroup, setShowCreateGroup] = useState(false)

    const dispatch = useDispatch()

    return (
        <div className='w-full h-full flex justify-between items-center p-2 bg-slate-800'>

            <div className='flex gap-2 items-center'>
                <IoLogoSnapchat className='text-3xl'/>
                <h1 className='text-2xl font-bold'>CHAT APP</h1>
            </div>
            <img onClick={() => setShowProfile(true)} className='w-[35px] h-[35px]' src={loggedInUser.profilePic} alt="" srcSet="" />

            {showProfile && <div onClick={() => setShowProfile(false)} className='w-full h-full absolute top-0 right-0 z-10'>

                <div className='w-[200px] absolute top-[13%] right-[10%] bg-slate-700 flex flex-col'>

                    <p className='capitalize text-center bg-slate-800 p-2'>{loggedInUser.userName}</p>

                    <button onClick={() => setShowCreateGroup(true)} className='text-start p-2 hover:bg-slate-500'>Create Group</button>
                    <button className='text-start p-2 hover:bg-slate-500'>Notification</button>
                    <button onClick={() => dispatch(setLoggedInUser(null))} className='text-start p-2 hover:bg-slate-500'>Logout</button>

                </div>

            </div>}

            {showCreateGroup && <CreateGroup setShowCreateGroup={setShowCreateGroup} />}

        </div>
    )
}

export default MainHeading
