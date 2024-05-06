import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { globalSocket } from '../../../App'
import { setSelectedUser } from '../../../redux/userSlice'
import { setChatType, setSelectedGroup } from '../../../redux/groupSlice'
import { setMessages, setNotifications, setSlideRightSide } from '../../../redux/messageSlice'
import axios from 'axios'
import dayjs from 'dayjs'
const OnlineUsers = () => {

    const { loggedInUser } = useSelector(store => store.user)
    const { notifications } = useSelector(store => store.message)
    const { selectedUser } = useSelector(store => store.user)
    const { onlineUsers } = useSelector(store => store.socket)
    const { selectedGroup } = useSelector(store => store.group)

    const dispatch = useDispatch()

    const [onlineFriends, setOnlineFriends] = useState(null)


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


    useEffect(() => {

        setOnlineFriends(loggedInUser.friends.filter((e) => onlineUsers.includes(e._id)))

    }, [])

    return (
        <>

            {onlineFriends && onlineFriends.length > 0
                ?
                onlineFriends?.map((e) => (
                    <>
                        <div
                            onClick={() => handleSelectedUser(e)}
                            key={e._id}
                            className={`w-full h-[60px] flex gap-2 items-center p-2 mt-2 hover:bg-slate-600 cursor-pointer ${selectedUser?._id == e._id ? "bg-slate-600" : "transparent"} relative`}>

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

                    </>
                ))

                :
                <div className='w-full h-full flex justify-center items-center'>NO FRIENDS ONLINE</div>
            }

        </>
    )
}

export default OnlineUsers
