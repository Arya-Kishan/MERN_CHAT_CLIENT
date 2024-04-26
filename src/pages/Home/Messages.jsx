import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from '../../redux/messageSlice'

const Messages = () => {

    const dispatch = useDispatch()
    const { messages } = useSelector(store => store.message)
    const { loggedInUserId } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)

    const lastDivref = useRef(null)

    const getConversation = async () => {
        let { data } = await axios.post(`/message/getMessages`, {
            "senderId": loggedInUserId,
            "receiverId": selectedUser._id
        })

        dispatch(setMessages(data?.data?.messages))
    }

    useEffect(() => {

        if (selectedUser) {
            getConversation();
        }

    }, [selectedUser])

    useEffect(() => {
        lastDivref.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])
    // console.log(loggedInUserId);
    // console.log(selectedUser);

    return (
        <div className='h-full bg-slate-600 flex flex-col gap-2 p-1 overflow-auto'>

            {messages
                ?
                messages.map((e) => (
                    <div ref={lastDivref} key={e._id} className={`w-full flex ${loggedInUserId == e.senderId ? "justify-end" : "justify-start"}`}><p className='w-[50%] bg-slate-900 rounded-lg p-1'>{e.message}</p></div>
                ))
                :
                <span className='text-center opacity-[0.2]'>NO MESSAGES</span>
            }

        </div>
    )
}

export default Messages
