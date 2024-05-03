import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setSelectedUser } from '../../../redux/userSlice'
import { setChatType, setSelectedGroup } from '../../../redux/groupSlice'
import { setMessages, setNotifications, setSlideRightSide } from '../../../redux/messageSlice'

const FriendsChat = () => {

    const { loggedInUser } = useSelector(store => store.user)
    const { notifications } = useSelector(store => store.message)
    const { selectedUser } = useSelector(store => store.user)
    const { selectedGroup } = useSelector(store => store.group)


    
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


    useEffect(() => {
        getUnseenMessages();
    }, [])


    return (
        <div>

            <div className='w-full h-[90%] overflow-y-scroll'>

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
                                        className='relative w-[60px]'>

                                        <img className='w-[60px]' src={e.profilePic} alt="" srcSet="" />

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
                        <p onClick={() => {
                            inputRef.current.focus()
                            searchDivRef.current.style.backgroundColor = 'gray';
                            inputRef.current.style.backgroundColor = 'gray';
                            setTimeout(() => {
                                inputRef.current.style.backgroundColor = 'transparent';
                                searchDivRef.current.style.background = 'white';
                            }, 500);
                        }} className='px-4 py-1 bg-slate-400 rounded-lg cursor-pointer hover:bg-slate-800'>ADD</p>
                    </div>}


            </div>

        </div>
    )
}

export default FriendsChat
