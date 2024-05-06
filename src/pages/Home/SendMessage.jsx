import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addNotifications, setMessages } from '../../redux/messageSlice'
import send from '../../assets/send.svg'
import { globalSocket } from '../../App';

let typingBool = true;

const SendMessage = () => {

    const inputRef = useRef(null)
    const { chatType } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)
    const { loggedInUserId } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)
    const { onlineUsers } = useSelector(store => store.socket)
    const { notifications } = useSelector(store => store.message)
    const { messages } = useSelector(store => store.message)
    const dispatch = useDispatch()

    const handleSendMessage = async () => {

        if (chatType == "solo") {

            const { data } = await axios.post(`/message/send`, {
                senderId: loggedInUserId,
                receiverId: selectedUser._id,
                senderMessage: inputRef.current.value
            })

            dispatch(setMessages([...messages || [], data.data]))

            // IF USER IS OFFLINE SAVING THE MESSAGE IN BACKEND FOR UNSEEN MESSAGE NOTIFICATION AND IF ONLINE THEN NOT SAVING IN BACKEND
            if (onlineUsers?.includes(selectedUser._id)) {
                console.log("USER IS ONLINE NOT SAVING THE MESSAGE IN BACKEND");
            } else {
                console.log("USER IS OFFLINE SAVING THE MESSAGE IN BACKEND FOR UNSEEN MESSAGE NOTIFICATION");
                let { data } = axios.post(`/message/unseenMessages?type=add`, {
                    senderId: loggedInUserId,
                    receiverId: selectedUser._id,
                    message: inputRef.current.value
                })

                console.log(data);

            }


        } else {

            const { data } = await axios.post(`/group/send`, {
                senderId: loggedInUserId,
                groupId: selectedGroup._id,
                message: inputRef.current.value
            })

            dispatch(setMessages([...messages || [], data.data]))

        }


        inputRef.current.value = "";

        handleHideTyping()
        typingBool = true;

    }

    // USED FOR SHOWING TYPING LOADER
    const handleShowTyping = () => {

        if (typingBool && chatType == "solo") {
            globalSocket.emit("User-Typing", { type: "start", userId: selectedUser._id });
            typingBool = false;
        }
    }

    // USED FOR HIDING TYPING LOADER
    const handleHideTyping = () => {
        if (chatType == "solo") {
            globalSocket.emit("User-Typing", { type: "stop", userId: selectedUser._id })
            typingBool = true;
        }
    }

    useEffect(() => {


        globalSocket?.on("newMessage", (newMessage) => {

            console.log("INSIDE SOCKET SOLO");
            console.log(newMessage);

            if (selectedUser?._id == newMessage?.senderId && chatType == "solo" && newMessage.hasOwnProperty("receiverId")) {
                console.log("USER VIWING THE CHAT OF SENDING USER SO DON'T SAVE IT AS NOTIFICATION");
                dispatch(setMessages([...messages, newMessage]));
            } else {
                console.log("USER HAS SELECTED AND VIEWING OTHER USER NOW THAT'S Y HAVE TO SAVE AS NOTIFICATION AND SHOW AS UNSEEN MESSAGE POP UP");
                console.log(notifications);
                dispatch(addNotifications(newMessage))
            }

        });




        globalSocket?.on("group-message", (newMessage) => {

            console.log("INSIDE SOCKET GROUP");
            console.log(selectedGroup);

            if (chatType == "group" && newMessage.groupId == selectedGroup._id && newMessage.hasOwnProperty("groupId")) {
                dispatch(setMessages([...messages, newMessage]));
            }

        });


        return () => globalSocket?.off("newMessage");

    }, [setMessages, messages]);

    console.log(selectedGroup);
    console.log(selectedUser);



    return (
        <div className='p-2 bg-slate-950'>

            <div className='flex items-center bg-white rounded-lg'>

                <input
                    ref={inputRef}
                    onChange={handleShowTyping}
                    onBlur={handleHideTyping}
                    onKeyUp={(e) => { e.key == "Enter" ? handleSendMessage() : null }}
                    className='w-full p-2 text-black rounded-lg border-none outline-none' type="text" placeholder='Type a message here...' />

                <img onClick={() => handleSendMessage()} className='w-[30px] mr-2' src={send} alt="" srcSet="" />

            </div>

        </div>
    )
}

export default SendMessage
