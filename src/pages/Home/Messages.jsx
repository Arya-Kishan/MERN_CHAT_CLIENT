import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from '../../redux/messageSlice'
import axios from 'axios'
import { setSelectedGroup } from '../../redux/groupSlice'
import { setSelectedUser } from '../../redux/userSlice'
import typingLoaderImg from "../../assets/TypingLoader.svg"
import dayjs from "dayjs"
import loader from "../../assets/TypingLoader.svg"

const Messages = () => {

    const dispatch = useDispatch()
    const { messages } = useSelector(store => store.message)
    const { typingLoader } = useSelector(store => store.message)
    const { chatType } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)
    const { loggedInUserId } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)

    const [loader, setLoader] = useState(false)

    const lastDivref = useRef(null)
    const typingLoaderDivref = useRef(null)

    // GET SOLO CHAT
    const getConversation = async () => {

        dispatch(setSelectedGroup(null))

        setLoader(true)

        let { data } = await axios.post(`/message/getMessages`, {
            "senderId": loggedInUserId,
            "receiverId": selectedUser._id
        })

        // console.log(data);

        setLoader(false)

        if (data?.data) {
            dispatch(setMessages(data?.data?.messages))
        } else {
            dispatch(setMessages(null))
        }

    }

    // GET GROUP MESSAGE
    const getGroupMessages = async () => {

        dispatch(setSelectedUser(null))

        let { data } = await axios.post(`/group/getGroupMessages`, {
            groupId: selectedGroup._id
        })

        console.log(data);

        if (data?.data) {
            dispatch(setMessages(data?.data?.groupMessages))
        } else {
            dispatch(setMessages(null))
        }

    }

    useEffect(() => {

        if (selectedUser && chatType == "solo") {
            console.log("FETCHING SOLO CHAT");
            getConversation();
        }

    }, [selectedUser])

    useEffect(() => {


        if (selectedGroup && chatType == "group") {
            console.log("FETCHING GROUP MESSAGES");
            getGroupMessages();
        }

    }, [selectedGroup])

    useEffect(() => {
        lastDivref.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    useEffect(() => {
        typingLoaderDivref.current?.scrollIntoView({ behavior: "smooth" });
    }, [typingLoader])


    return (
        <div className='h-full bg-slate-950 flex flex-col gap-3 p-3 overflow-auto'>

            {loader ? <p className='text-center opacity-[0.2]'>Getting Messages...</p> : <>
                {messages?.length > 0
                    ?
                    messages.map((e) => (
                        <div
                            ref={lastDivref}
                            key={e._id}
                            className={`w-full flex ${loggedInUserId == (selectedGroup ? e.senderId._id : e.senderId) ? "justify-end" : "justify-start"}`} >

                            <p className={`flex flex-col w-[48%] bg-slate-900 rounded-xl ${loggedInUserId == (selectedGroup ? e.senderId._id : e.senderId) ? "rounded-br-none" : "rounded-bl-none"} p-2`}>

                                <span className='text-[10px] text-slate-400 capitalize'>
                                    {selectedGroup && e.senderId.userName}
                                </span>

                                <span>{e.message}</span>

                                <span className='text-[10px] text-end text-slate-400'>
                                    {dayjs(e.createdAt).format("hh:mm a")}
                                </span>

                            </p>

                        </div>
                    ))
                    :
                    <span className='text-center opacity-[0.2]'>NO MESSAGES</span>
                }
            </>}

            {typingLoader.typing && chatType == "solo" && <div ref={typingLoaderDivref} className='flex w-[60px] p-1 bg-slate-900 rounded-lg'>
                <img className='w-[20px]' src={typingLoaderImg} alt="" srcset="" />
            </div>}

        </div>
    )
}

export default Messages
