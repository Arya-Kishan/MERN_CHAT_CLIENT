import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from '../../redux/messageSlice'
import axios from 'axios'
import { setSelectedGroup } from '../../redux/groupSlice'
import { setSelectedUser } from '../../redux/userSlice'
import typingLoaderImg from "../../assets/TypingLoader.svg"
import dayjs from "dayjs"
import loader from "../../assets/TypingLoader.svg"
import MessageBox from '../../Component/MessageBox'
import { toast } from 'react-toastify'

const Messages = () => {

    const dispatch = useDispatch()
    const { messages } = useSelector(store => store.message)
    const { typingLoader } = useSelector(store => store.message)
    const { chatType } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)
    const { loggedInUserId } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)

    const [loader, setLoader] = useState(false)

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
        setLoader(true)

        try {

            let res = await axios.post(`/group/getGroupMessages`, {
                groupId: selectedGroup._id
            })

            if (res.status == 200) {
                dispatch(setMessages(res.data?.data?.groupMessages))
                setLoader(false)
            } else {
                dispatch(setMessages(null))
                setLoader(false)
            }

        } catch (error) {
            setLoader(false)
            dispatch(setMessages(null))
            toast("Error Occured")
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
        typingLoaderDivref.current?.scrollIntoView({ behavior: "smooth" });
    }, [typingLoader])


    return (
        <div className='h-full bg-slate-950 flex flex-col gap-3 p-3 overflow-auto relative'>

            {loader ? <p className='text-center opacity-[0.2]'>Getting Messages...</p> : <>
                {messages?.length > 0
                    ?
                    messages.map((e) => (
                        <MessageBox key={e._Id} message={e} />
                    ))
                    :
                    <span className='text-center opacity-[0.2]'>NO MESSAGES</span>
                }
            </>}

            {messages?.length > 0 ? typingLoader.typing && chatType == "solo" && <div ref={typingLoaderDivref} className='flex w-[60px] p-1 bg-slate-900 rounded-lg'>
                <img className='w-[20px]' src={typingLoaderImg} alt="" srcSet="" />
            </div> : typingLoader.typing && chatType == "solo" && <div ref={typingLoaderDivref} className='flex w-[60px] p-1 bg-slate-900 rounded-lg absolute bottom-2 left-2'>
                <img className='w-[20px]' src={typingLoaderImg} alt="" srcSet="" />
            </div>}

        </div>
    )
}

export default Messages
