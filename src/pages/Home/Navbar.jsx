import React, { useState } from 'react'
import { IoChatboxSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { IoMdAddCircle } from "react-icons/io";
import { MdContactPage } from "react-icons/md";


const Navbar = ({ setShow }) => {

    const [options, setOptions] = useState({ chatBtn: false, groupBtn: false, addBtn: false, settingBtn: false })

    console.log(options);

    return (
        <>

            <IoChatboxSharp
                onClick={() => {
                    setOptions({ chatBtn: true, groupBtn: false, addBtn: false, settingBtn: false })
                    setShow({ friendChat: true, groupChat: false, searchBook: false })
                }}
                className={`text-3xl cursor-pointer p-1 ${options.chatBtn ? "text-[red]" : "text-white"}`} />

            <HiUserGroup
                onClick={() => {
                    setOptions({ chatBtn: false, groupBtn: true, addBtn: false, settingBtn: false })
                    setShow({ friendChat: false, groupChat: true, searchBook: false })
                }}
                className={`text-3xl cursor-pointer p-1 ${options.groupBtn ? "text-[red]" : "text-white"}`} />

            <IoMdAddCircle
                onClick={() => {
                    setOptions({ chatBtn: false, groupBtn: false, addBtn: true, settingBtn: false })
                    setShow({ friendChat: false, groupChat: true, searchBook: false })
                }}
                className={`text-3xl cursor-pointer p-1 ${options.addBtn ? "text-[red]" : "text-white"}`} />

            <MdContactPage
                onClick={() => {
                    setOptions({ chatBtn: false, groupBtn: false, addBtn: false, settingBtn: true })
                    setShow({ friendChat: false, groupChat: false, searchBook: true })
                }}
                className={`text-3xl cursor-pointer p-1 ${options.settingBtn ? "text-[red]" : "text-white"}`} />


        </>
    )
}

export default Navbar
