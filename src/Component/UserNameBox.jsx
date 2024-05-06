import React from 'react'

const userNameBox = ({ user }) => {
    return (
        <>
            {user && <p className='w-full flex gap-2 items-center'>

                <img className='w-[50px] h-[50px]' src={user.profilePic} alt="" srcSet="" />

                <span className='text-xl'>{user.userName}</span>

            </p>}
        </>
    )
}

export default userNameBox
