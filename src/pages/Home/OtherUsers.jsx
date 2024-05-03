import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFriends, searchUserAsync, setSearchUserResult, setSelectedUser } from '../../redux/userSlice'
import { debounce } from "lodash"
import { IoSearchSharp } from "react-icons/io5";
import { setChatType, setSelectedGroup, setUserGroup } from '../../redux/groupSlice'
import { MdGroups } from "react-icons/md";
import { globalSocket } from '../../App'
import { addNotifications, setMessages, setNotifications, setSlideRightSide } from '../../redux/messageSlice'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import { FaUsersSlash, FaUsers } from "react-icons/fa6";
import { toast } from 'react-toastify'
import Navbar from './Navbar'

const OtherUsers = () => {

    const { userGroups } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)
    const { searchUserResult } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)
    const { loggedInUser } = useSelector(store => store.user)
    const { notifications } = useSelector(store => store.message)
    const { onlineUsers } = useSelector(store => store.socket)

    const [showSearch, setShowSearch] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [showOtherUserProfile, setShowOtherUserProfile] = useState({ user: null, show: false });

    const inputRef = useRef(null)
    const searchDivRef = useRef(null)

    const dispatch = useDispatch()


    const getUserGroups = async () => {
        const { data } = await axios(`/group/getUserGroups?userId=${loggedInUser._id}`)
        // console.log(data.data);
        dispatch(setUserGroup(data?.data))

    }

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

    const handleGroupSelected = (elem) => {
        dispatch(setSelectedGroup(elem))
        dispatch(setChatType("group"))
        dispatch(setMessages([]))
        dispatch(setSlideRightSide("left-0"))
        // dispatch(setSelectedUser(null))

        // JOINING A GROUP OR CREATING IT
        globalSocket?.emit("group-selection", { groupId: elem?._id, groupName: elem?.groupName });

    }

    const handleDebounce = debounce(() => {

        console.log(inputRef.current.value);

        if (inputRef.current.value.length < 1) {
            dispatch(setSearchUserResult({ loader: "idle", data: [] }))
        } else {
            dispatch(searchUserAsync({ query: inputRef.current.value }))
        }

    }, 500)


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
        getUserGroups();
        getUnseenMessages();
    }, [])

    useEffect(() => {
        if (showAll) {
            dispatch(searchUserAsync({ query: "" }))
        } else {
            dispatch(setSearchUserResult({ loader: "idle", data: [] }))
        }
    }, [showAll])


    useEffect(() => {

        let a = notifications.filter((elem) => (elem.senderId == "6629e40cb5250daccc8b2c23")).length
        console.log(a);

    }, [notifications])

    const onFocus = () => {
        console.log("focused");
        setShowSearch(true)
    }

    const onBlur = () => {
        console.log("focused NOT");
        // setShowSearch(false)
    }

    const handleMakeFriend = async (user) => {

        toast("Adding Friend")
        const res = await axios.post("/user/addFriend", {
            senderRequestUserId: loggedInUser._id,
            receiverRequestUserId: user._id
        })

        if (res.status == 200) {
            setShowSearch(false)
            dispatch(addFriends(res?.data?.data))
            inputRef.current.value = "";
            setShowOtherUserProfile({ user: null, show: false })
            toast("Added")
        } else {
            toast("Error Occured")
        }


        console.log(res.data.data);

    }


    return (
        <div className='bg-slate-900 h-full p-2 overflow-auto flex flex-col justify-evenly items-center relative'>

            {/* SEARCH USER */}
            <div ref={searchDivRef} className='w-full h-[7%] flex justify-between items-center p-2 gap-2 bg-white rounded-lg'>
                <input ref={inputRef} onChange={handleDebounce} onFocus={onFocus} onBlur={onBlur} className='w-[80%] text-black border-none outline-none' type="text" placeholder='Search User...' />
                <IoSearchSharp className='text-2xl text-black' />
            </div>

            {/* SHOWING SEARCH USER RESULT */}
            {showSearch &&
                <div className='w-full flex flex-col gap-2 p-2 h-[90%] relative bg-slate-500 rounded-xl'>

                    {searchUserResult.loader == "loading"
                        ?
                        <div className='h-full flex items-center justify-center'>Loading...</div>
                        :
                        <>
                            {searchUserResult.data.length > 0
                                ?
                                <div className='flex flex-col gap-2 overflow-y-scroll'>
                                    {searchUserResult.data.map((e) => (
                                        <div key={e._id} onClick={() => setShowOtherUserProfile({ user: e, show: true })} className='flex gap-2 cursor-pointer'>

                                            <img className='w-[40px] h-[40px]' src={e.profilePic} alt="" srcSet="" />

                                            <p className='capitalize'>{e.userName}</p>

                                        </div>
                                    ))}
                                </div>
                                :
                                <div className='h-full flex items-center justify-center'>NO USER FOUND "{inputRef.current.value}"</div>}
                        </>}

                    <p
                        onClick={(() => {
                            setShowSearch(false)
                            inputRef.current.value = ""
                        })}
                        className='absolute right-2 bottom-2 w-[40px] h-[40px] bg-red-800 rounded-full flex justify-center items-center border-2 border-solid border-white cursor-pointer hover:border-black transition-all'>
                        X
                    </p>

                    <div onClick={() => setShowAll(!showAll)} className='absolute bottom-3 left-3 cursor-pointer bg-slate-800 rounded-full border-2 border-white p-2'>
                        {!showAll ? <FaUsersSlash className='text-2xl' /> : <FaUsers className='text-2xl' />}
                    </div>



                </div>}





            {/* SHOWING FRIENDS */}
            {!showSearch
                &&
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


                    {/* SHOWING GROUP CHATS IN LEFT SIDE */}
                    <div className='flex flex-col gap-2'>
                        {
                            userGroups?.map((elem) => (
                                <div key={elem._id} onClick={() => handleGroupSelected(elem)} className={`flex ${selectedGroup?._id == elem._id ? "bg-slate-600" : "transparent"} hover:bg-slate-600 cursor-pointer p-2`}>

                                    <MdGroups className='bg-white rounded-full text-yellow-500 p-1 w-[40px] h-[40px]' />

                                    <p className='capitalize p-2'>{elem.groupName}</p>

                                </div>
                            ))
                        }
                    </div>

                </div>}

            {/* SHOWING SEARCHED USER PROFILE TO CONNECT FOR START CHAT */}
            {showOtherUserProfile.show && <div onClick={() => setShowOtherUserProfile(false)} className='w-full h-full bg-gradient-to-r from-black fixed top-0 left-0 flex justify-center items-center z-10'>

                <div onClick={(e) => e.stopPropagation()} className='w-[80%] sm:w-[40%] h-[50%] bg-slate-900 rounded-xl shadow-lg shadow-slate-800 flex justify-center items-center flex-col gap-2 relative'>

                    <img className='w-[80px] h-[80px]' src={showOtherUserProfile?.user?.profilePic} alt="" srcSet="" />

                    <p className='capitalize text-3xl'>{showOtherUserProfile?.user?.userName}</p>

                    <p className='capitalize text-3xl absolute top-0 left-0 text-[10px] p-2'>JOINED : {dayjs(showOtherUserProfile?.user?.createdAt).format("DD-MM-YY")}</p>

                    <p className='text-3xl absolute top-0 right-0 text-[10px] p-2'>ACTIVE : {dayjs().from(dayjs(showOtherUserProfile?.user?.active)).split(" ").slice(1).join(" ")} ago</p>

                    <p onClick={() => handleMakeFriend(showOtherUserProfile.user)} className='text-center p-2 mt-8'><span className='bg-slate-600 p-2 rounded-md mt-4 cursor-pointer hover:bg-slate-800'>Connect</span></p>

                </div>

            </div>}

            <Navbar />

        </div>
    )
}

export default OtherUsers
