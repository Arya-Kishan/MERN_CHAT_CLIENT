import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../../../redux/userSlice'
import { setChatType, setSelectedGroup } from '../../../redux/groupSlice'
import { setMessages, setNotifications, setSlideRightSide } from '../../../redux/messageSlice'
import { globalSocket } from '../../../App'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import axios from 'axios'
import { debounce } from 'lodash'
import addUserWhite from '../../../assets/addUserWhite.svg'
import search from '../../../assets/search.svg'

const FriendsChat = () => {

    const { loggedInUser } = useSelector(store => store.user)
    const { notifications } = useSelector(store => store.message)
    const { selectedUser } = useSelector(store => store.user)
    const { onlineUsers } = useSelector(store => store.socket)
    const { selectedGroup } = useSelector(store => store.group)

    const dispatch = useDispatch()

    const inputRef = useRef(null)



    const handleSelectedUser = (e) => {

        // BELOW SOCKET USED TO MAKE USER LEAVE THE SOCKET GROUP
        if (selectedGroup) {
            console.log("MAKING USER LEAVE GROUP");
            globalSocket.emit("leave-group", { userId: loggedInUser._id, groupId: selectedGroup._id })
        }

        dispatch(setSelectedUser(e))
        dispatch(setChatType("solo"))
        dispatch(setSelectedGroup(null))
        dispatch(setMessages([]))

        let notificationToDeleteFromBackend_Arr = notifications?.filter((elem) => (elem.senderId == e._id))
        console.log(notificationToDeleteFromBackend_Arr);

        dispatch(setNotifications(notifications?.filter((elem) => (elem.senderId != e._id))))
        dispatch(setSlideRightSide("left-0"))


        async function deleteUnseenMessages() {

            console.log(notificationToDeleteFromBackend_Arr);

            let res = await axios.post(`/message/unseenMessages?type=delete`, notificationToDeleteFromBackend_Arr)

            console.log(res);

        }

        deleteUnseenMessages()

    }



    async function getUnseenMessages() {

        let res = await axios.post(`/message/unseenMessages?type=get`, {
            receiverId: loggedInUser._id,
        })

        console.log(res.data?.data);

        if (res.status == 200) {
            dispatch(setNotifications(res?.data?.data))
        }

    }


    const handleDebounce = debounce(() => {

        console.log(inputRef.current.value);

    }, 500)


    useEffect(() => {
        getUnseenMessages();
    }, [])


    return (

        <div className='w-full h-[100%] overflow-y-scroll pb-16 flex flex-col items-center gap-2'>

            {/* SEARCH USER */}
            <div className='w-[98%] h-[7%] flex justify-between items-center p-3 gap-2 bg-white rounded-lg'>
                <input ref={inputRef} onChange={handleDebounce} className='w-[80%] text-xl md:text-[16px] text-black border-none outline-none' type="text" placeholder='Filter' />
                <img className='w-[20px]' src={search} alt="" srcset="" />
            </div>

            {/* SHOW OTHER USERS MEANS YOUR FRINDS IN LEFT SIDE */}
            {loggedInUser.friends.length > 0
                ?
                <>
                    {
                        loggedInUser.friends?.map((e) => (

                            <div
                                onClick={() => handleSelectedUser(e)}
                                key={e._id}
                                className={`w-full h-[60px] flex gap-2 items-center p-2 hover:bg-slate-600 cursor-pointer ${selectedUser?._id == e._id ? "bg-slate-600" : "transparent"} relative`}>

                                <div
                                    className='relative w-[60px] h-[60px]'>

                                    <img loading='lazy' className='w-[60px]' src={e.profilePic} alt="" srcSet="" />

                                    {onlineUsers?.includes(e._id) && <span className='absolute top-0 right-0 bg-green-600 text-xl w-[8px] h-[8px] rounded-full'></span>}

                                </div>

                                <div className='h-full flex flex-col items-start justify-start w-full'>

                                    <p className='capitalize text-xl'>{e.userName}</p>
                                    {/* <p className='capitalize text-[10px]'>There was a time in history</p> */}

                                </div>

                                <div className='h-full flex flex-col justify-start items-end gap-2 w-[80px]'>

                                    <span className='text-[10px]'>{dayjs(e.active).format("hh:mm a")}</span>

                                    <span className=''>{notifications.filter((elem) => (elem.senderId == e._id)).length > 0 ? <p className='w-[20px] h-[20px] rounded-full flex justify-center items-center text-[10px] bg-slate-700'>{notifications.filter((elem) => (elem.senderId == e._id)).length}</p> : ""}</span>

                                </div>

                            </div>

                        ))
                    }
                </>
                :
                <div className='h-full flex flex-col justify-center items-center gap-2'>
                    <p>NO CONTACTS</p>
                    <img className='w-[20px]' src={addUserWhite} alt="" srcset="" />
                </div>}


        </div>

    )
}

export default FriendsChat
