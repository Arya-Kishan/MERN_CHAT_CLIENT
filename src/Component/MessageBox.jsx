import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from "react-toastify"
import { deleteMessage, updateMessages } from '../redux/messageSlice'
import correct from '../assets/correct.svg'
import wrong from '../assets/wrong.svg'
import loaderIcon from '../assets/loader.svg'

const MessageBox = ({ message }) => {

    const dispatch = useDispatch()

    const [showOption, setShowOption] = useState(false)
    const [inputUpdate, setInputUpdate] = useState(false)
    const [loader, setLoader] = useState(false)
    const { chatType } = useSelector(store => store.group)

    const lastDivref = useRef(null)
    const updateInputRef = useRef(null)

    const { selectedGroup } = useSelector(store => store.group)
    const { loggedInUserId } = useSelector(store => store.user)

    const handleEdit = async () => {
        console.log(message);
        setLoader(true)

        try {
            let res = await axios.post("/message/updateMessage", {
                type: chatType == "solo" ? "solo" : 'group',
                messageId: message._id,
                newMessage: updateInputRef.current.value
            })

            console.log(res.data.data);

            if (res.status == 200) {
                dispatch(updateMessages(res?.data?.data))
            }

        } catch (error) {
            toast("NOT UPDATED")
            console.log(error);
        }

        setShowOption(false)
        setLoader(false)

    }

    const handleDelete = async () => {
        console.log(message);
        setLoader(true)

        try {
            let res = await axios.post("/message/deleteMessage", {
                type: chatType == "solo" ? "solo" : 'group',
                messageId: message._id,
            })

            console.log(res?.data?.data);

            if (res.status == 200) {
                dispatch(deleteMessage(res?.data?.data))
            }

        } catch (error) {
            toast("NOT DELETED")
            console.log(error);
        }

        setLoader(false)
        setShowOption(false)

    }

    useEffect(() => {
        lastDivref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message])



    return (
        <div
            ref={lastDivref}
            key={message._id}
            className={`w-full flex ${loggedInUserId == (selectedGroup ? message.senderId._id : message.senderId) ? "justify-end" : "justify-start"} relative`} >

            <div
                onClick={() => setShowOption(true)}
                className={`flex flex-col w-[48%] bg-slate-900 rounded-xl ${loggedInUserId == (selectedGroup ? message.senderId._id : message.senderId) ? "rounded-br-none" : "rounded-bl-none"} p-2`}>

                <span className='text-[10px] text-slate-400 capitalize'>
                    {selectedGroup && message.senderId.userName}
                </span>

                <div>{inputUpdate
                    ?
                    <div onClick={e => e.stopPropagation()} className='flex flex-col gap-1'>
                        <input
                            ref={updateInputRef}
                            className='bg-slate-700 rounded-md p-1 border-none outline-none'
                            type="text" />

                        <div className='flex gap-2'>

                            <img onClick={() => {
                                setInputUpdate(false)
                                setShowOption(false)
                            }} className='w-[25px]' src={wrong} alt="" srcSet="" />

                            <img onClick={() => {
                                handleEdit()
                                setInputUpdate(false)
                            }} className='w-[25px]' src={correct} alt="" srcSet="" />

                        </div>

                    </div>

                    :

                    // if found message as deleted then show small text deleted text otherwise show message
                    message.message == "Deleted..." ? <span className='text-red text-[10px]'>Deleted ...</span> : message.message}</div>


                <span className='text-[10px] text-end text-slate-400'>
                    {dayjs(message.createdAt).format("hh:mm a")}
                </span>

            </div>


            {/* OPTIONS FOR DELETE UPDATE SINGLE MESSAGE */}
            {showOption && loggedInUserId == (selectedGroup ? message.senderId._id : message.senderId) &&
                <div className='absolute top-0 right-[48%] w-[30%] rounded-xl p-2 z-10'>

                    <p onClick={() => {
                        setShowOption(false)
                        setInputUpdate(false)
                    }} className='text-end p-2'>X</p>

                    <p onClick={() => {
                        setInputUpdate(true)
                        setShowOption(false)
                    }} className='bg-slate-900 p-2 cursor-pointer hover:bg-slate-800'>Edit</p>

                    <p onClick={() => {
                        handleDelete()
                        setShowOption(false)
                    }} className='bg-slate-900 p-2 cursor-pointer hover:bg-slate-800'>Delete</p>

                </div>
            }


            {loader && <div className='absolute top-0 right-0'>
                <img className='w-[20px] h-[20px]' src={loaderIcon} alt="" srcSet="" />
            </div>}



        </div>
    )
}

export default MessageBox
