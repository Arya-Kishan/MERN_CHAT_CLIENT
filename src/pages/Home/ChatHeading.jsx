import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ChatHeading = () => {

    const dispatch = useDispatch()
    const { selectedUser } = useSelector(store => store.user)

    return (
        <>
            {selectedUser
                ?
                <div className='flex gap-2 items-center p-2 bg-slate-500'>
                    <div className='w-[40px] h-[40px]'><img className='w-[40px]' src={selectedUser.profilePic} alt="" srcSet="" /></div>
                    <p>{selectedUser.userName}</p>
                </div>
                :
                <div className='flex gap-2 items-center p-2 bg-slate-500'>
                    <div className='w-[40px] h-[40px]'><img className='w-[40px]' src="https://avatar.iran.liara.run/public/girl" alt="" srcSet="" /></div>
                    <p>Unknown</p>
                </div>}
        </>
    )
}

export default ChatHeading
