import React, { useState } from 'react'
import { IoChatboxSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { IoMdAddCircle } from "react-icons/io";
import { MdContactPage } from "react-icons/md";


const Navbar = () => {

    const [options, setOptions] = useState({ chatBtn: false, groupBtn: false, addBtn: false, settingBtn: false })

    console.log(options);

    return (
        <>
            <div className='w-[100%] absolute bottom-0 left-0   bg-slate-950 flex justify-center items-center rounded-tl-xl rounded-tr-xl'>

                <div className='w-full flex items-center justify-evenly gap-2 p-2'>

                    <IoChatboxSharp
                        onClick={() => setOptions({ chatBtn: true, groupBtn: false, addBtn: false, settingBtn: false })}
                        className={`text-3xl p-1 ${options.chatBtn ? "text-[red]" : "text-white"}`} />

                    <HiUserGroup
                        onClick={() => setOptions({ chatBtn: false, groupBtn: true, addBtn: false, settingBtn: false })}
                        className={`text-3xl p-1 ${options.groupBtn ? "text-[red]" : "text-white"}`} />

                    <IoMdAddCircle
                        onClick={() => setOptions({ chatBtn: false, groupBtn: false, addBtn: true, settingBtn: false })}
                        className={`text-3xl p-1 ${options.addBtn ? "text-[red]" : "text-white"}`} />

                    <MdContactPage
                        onClick={() => setOptions({ chatBtn: false, groupBtn: false, addBtn: false, settingBtn: true })}
                        className={`text-3xl p-1 ${options.settingBtn ? "text-[red]" : "text-white"}`} />

                </div>


            </div>
        </>
    )
}

export default Navbar
