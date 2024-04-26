import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../../redux/messageSlice'

const SendMessage = () => {

    const inputRef = useRef(null)
    const { loggedInUserId } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)
    const { messages } = useSelector(store => store.message)
    const { socket } = useSelector(store => store.socket)
    const dispatch = useDispatch()

    const handleSendMessage = async () => {

        const { data } = await axios.post(`/message/send`, {
            senderId: loggedInUserId,
            receiverId: selectedUser._id,
            senderMessage: inputRef.current.value
        })

        console.log(data);
        dispatch(setMessages([...messages || [], data.data]))
        inputRef.current.value = "";

    }

    useEffect(()=>{
        
        socket?.on("newMessage", (newMessage)=>{
            dispatch(setMessages([...messages, newMessage]));
        });

        return () => socket?.off("newMessage");

    },[setMessages, messages]);


    return (
        <div>
            <input ref={inputRef} className='w-[80%] p-1 text-black' type="text" placeholder='Write...' />
            <button onClick={() => handleSendMessage()} className='w-[20%] bg-teal-500 p-1'>Send</button>
        </div>
    )
}

export default SendMessage
