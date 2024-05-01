import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from '../../redux/messageSlice'
import axios from 'axios'
import { setSelectedGroup } from '../../redux/groupSlice'
import { setSelectedUser } from '../../redux/userSlice'
import dayjs from "dayjs"

const Messages = () => {

    const dispatch = useDispatch()
    const { messages } = useSelector(store => store.message)
    const { selectedGroup } = useSelector(store => store.group)
    const { loggedInUserId } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)

    const lastDivref = useRef(null)

    // GET SOLO CHAT
    const getConversation = async () => {

        dispatch(setSelectedGroup(null))

        let { data } = await axios.post(`/message/getMessages`, {
            "senderId": loggedInUserId,
            "receiverId": selectedUser._id
        })

        // console.log(data);

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

        console.log("FETCHING SOLO CHAT");
        if (selectedUser) {
            getConversation();
        }

    }, [selectedUser])

    useEffect(() => {


        if (selectedGroup) {
            console.log("FETCHING GROUP MESSAGES");
            getGroupMessages();
        }

    }, [selectedGroup])

    useEffect(() => {
        lastDivref.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    // console.log(selectedUser);
    // console.log(selectedGroup);
    console.log(messages);

    return (
        <div className='h-full bg-slate-600 flex flex-col gap-3 p-3 overflow-auto'>

            {messages?.length > 0
                ?
                messages.map((e) => (
                    <div ref={lastDivref} key={e._id} className={`w-full flex ${loggedInUserId == (selectedGroup ? e.senderId._id : e.senderId) ? "justify-end" : "justify-start"}`}>
                        <p className='flex flex-col w-[50%] bg-slate-900 rounded-lg p-2'>
                            <span className='text-[10px] text-slate-400 capitalize'>{selectedGroup && e.senderId.userName}</span>
                            <span>{e.message}</span>
                            <span className='text-[10px] text-end text-slate-400'>{dayjs(e.createdAt).format("hh:mm a")}</span>
                        </p>
                    </div>
                ))
                :
                <span className='text-center opacity-[0.2]'>NO MESSAGES</span>
            }

        </div>
    )
}

export default Messages
