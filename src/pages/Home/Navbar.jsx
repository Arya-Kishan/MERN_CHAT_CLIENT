import React, { useState } from 'react'

import chatWhite from '../../assets/chatWhite.svg'
import chatRed from '../../assets/chatRed.svg'
import groupRed from '../../assets/groupRed.svg'
import groupWhite from '../../assets/groupWhite.svg'
import addUserRed from '../../assets/addUserRed.svg'
import addUserWhite from '../../assets/addUserWhite.svg'
import addWhite from '../../assets/addWhite.svg'
import addRed from '../../assets/addRed.svg'
import onlineUserWhite from '../../assets/onlineUserWhite.svg'
import onlineUserRed from '../../assets/onlineUserRed.svg'

const Navbar = ({ setShow }) => {

    const [options, setOptions] = useState({ chatBtn: true, groupBtn: false, addBtn: false, settingBtn: false })

    console.log(options);

    return (
        <>

            <div
                onClick={() => {
                    setOptions({ chatBtn: true, groupBtn: false, addBtn: false, settingBtn: false })
                    setShow({ friendChat: true, groupChat: false, onlineFriend: false, searchBook: false })
                }}
                className='flex items-center justify-center cursor-pointer'>
                {options.chatBtn ? <img className='w-[30px]' src={chatRed} alt="" srcSet="" /> : <img className='w-[30px]' src={chatWhite} alt="" srcSet="" />}
            </div>


            <div
                onClick={() => {
                    setOptions({ chatBtn: false, groupBtn: true, addBtn: false, settingBtn: false })
                    setShow({ friendChat: false, groupChat: true, onlineFriend: false, searchBook: false })
                }}
                className='flex items-center justify-center cursor-pointer'>
                {options.groupBtn ? <img className='w-[30px]' src={groupRed} alt="" srcSet="" /> : <img className='w-[30px]' src={groupWhite} alt="" srcSet="" />}
            </div>


            <div
                onClick={() => {
                    setOptions({ chatBtn: false, groupBtn: false, addBtn: true, settingBtn: false })
                    setShow({ friendChat: false, groupChat: false, onlineFriend: true, searchBook: false })
                }}
                className='flex items-center justify-center cursor-pointer'>
                {
                    options.addBtn
                        ?
                        <div className='relative w-[30x] h-[30px] '>
                            <img className='w-[30px]' src={onlineUserRed} alt="" srcSet="" />
                            <p className='w-[10px] h-[10px] bg-green-500 absolute top-0 right-0 rounded-full'></p>
                        </div>
                        :
                        <div className='relative w-[30x] h-[30px] '>
                            <img className='w-[30px]' src={onlineUserWhite} alt="" srcSet="" />
                            <p className='w-[10px] h-[10px] bg-green-500 absolute top-0 right-0 rounded-full'></p>
                        </div>
                }
            </div>


            <div
                onClick={() => {
                    setOptions({ chatBtn: false, groupBtn: false, addBtn: false, settingBtn: true })
                    setShow({ friendChat: false, groupChat: false, onlineFriend: false, searchBook: true })
                }}
                className='flex items-center justify-center cursor-pointer'>
                {options.settingBtn ? <img className='w-[30px]' src={addUserRed} alt="" srcSet="" /> : <img className='w-[30px]' src={addUserWhite} alt="" srcSet="" />}
            </div>


        </>
    )
}

export default Navbar
