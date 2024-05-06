import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import info from "../../assets/info.svg";
import dayjs from "dayjs"
import group from "../../assets/group.svg";
import relativeTime from "dayjs/plugin/relativeTime"
import UserNameBox from '../../Component/UserNameBox'
dayjs.extend(relativeTime)

const ChatHeading = () => {

    const { selectedUser } = useSelector(store => store.user)
    const { loggedInUser } = useSelector(store => store.user)
    const { onlineUsers } = useSelector(store => store.socket)
    const { chatType } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)

    const [showMembers, setShowMembers] = useState(false)

    return (
        <>
            {chatType == "solo"
                ?
                <div className='flex gap-2 items-center justify-between p-4 md:py-1 md:px-4 bg-slate-900'>

                    <div className='flex gap-2 items-center'>

                        <img className='w-[50px] md:w-[35px]' src={selectedUser.profilePic} alt="" srcSet="" />

                        <div>
                            <p className='text-2xl md:text-[20px]'>{selectedUser.userName}</p>
                            {onlineUsers?.includes(selectedUser._id) ? <span className='text-green-800 text-[14px] md:text-[12px]'>Active Now</span> : <p className='text-[14px] md:text-[12px]'>{dayjs().from(dayjs(selectedUser.active)).split(" ").slice(1).join(" ")} ago</p>}
                        </div>

                    </div>

                    <img className='w-[20px]' onClick={() => setShowMembers(true)} src={info} alt="" srcSet="" />

                </div>
                :
                <div className='flex gap-2 items-center justify-between p-2 bg-slate-500'>

                    <div className='flex items-center gap-2'>
                        <img className='w-[30px]' src={group} alt="" srcSet="" />
                        <p>{selectedGroup.groupName}</p>
                    </div>

                    <img className='w-[20px]' onClick={() => setShowMembers(true)} src={info} alt="" srcSet="" />

                </div>}


            {showMembers && <div onClick={() => setShowMembers(false)} className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gradient-to-r from-black z-10'>

                <div className='w-[80%] md:w-[50%] h-[50vh] flex flex-col gap-4 bg-slate-800 p-4'>

                    <h1 className='font-bold text-2xl text-center'>Members</h1>

                    {selectedGroup
                        ?
                        <div className='flex flex-col gap-4'>

                            <div className='flex gap-2'><UserNameBox user={selectedGroup?.groupCreatedBy} /><span>OWNER</span></div>

                            {selectedGroup?.groupMembers.map((e) => (<UserNameBox key={e._id} user={e} />))
                            }

                        </div>
                        :
                        <div className='flex flex-col gap-4'>

                            <UserNameBox user={loggedInUser} />

                            <UserNameBox user={selectedUser} />

                        </div>}

                </div>

            </div>}

        </>
    )
}

export default ChatHeading
