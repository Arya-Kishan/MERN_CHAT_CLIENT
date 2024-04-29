import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiInformationLine } from "react-icons/ri";
import dayjs from "dayjs"
import { MdGroups } from "react-icons/md";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

const ChatHeading = () => {

    const dispatch = useDispatch()
    const { selectedUser } = useSelector(store => store.user)
    const { otherUsers } = useSelector(store => store.user)
    const { onlineUsers } = useSelector(store => store.socket)
    const { chatType } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)

    const [showMembers, setShowMembers] = useState(false)

    const getUserNameByUserId = (userId) =>{

        let a = otherUsers.filter((e) => e._id == userId)

        return (a[0]?.userName);

    }

    return (
        <>
            {chatType == "solo"
                ?
                <div className='flex gap-2 items-center justify-between p-2 bg-slate-500'>

                    <div className='flex gap-2 items-center'>
                        <img className='w-[40px]' src={selectedUser.profilePic} alt="" srcSet="" />
                        <div>
                            <p>{selectedUser.userName}</p>
                            {onlineUsers?.includes(selectedUser._id) ? "Active Now" : <p className='text-[12px]'>{dayjs().from(dayjs(selectedUser.active)).split(" ").slice(1).join(" ")} ago</p>}
                        </div>
                    </div>

                    <RiInformationLine onClick={() => setShowMembers(true)} className='text-xl text-slate-400' />

                </div>
                :
                <div className='flex gap-2 items-center justify-between p-2 bg-slate-500'>

                    <div className='flex items-center gap-2'>
                        <MdGroups className='bg-white rounded-full text-yellow-500 p-1 w-[40px] h-[40px]' />
                        <p>{selectedGroup.groupName}</p>
                    </div>

                    <RiInformationLine onClick={() => setShowMembers(true)} className='text-xl text-slate-400' />

                </div>}


            {showMembers && <div onClick={() => setShowMembers(false)} className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gradient-to-r from-black z-10'>

                <div className='w-[80%] md:w-[50%] h-[50vh] flex flex-col gap-2 bg-slate-800 p-4'>
                    <h1 className='font-bold text-2xl text-center'>Members</h1>
                    {selectedGroup?.groupMembers.map((e) => (<p key={e} className='capitalize'>{getUserNameByUserId(e)}</p>))}
                </div>
            </div>}

        </>
    )
}

export default ChatHeading
