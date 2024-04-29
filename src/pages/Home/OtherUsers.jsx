import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedInUser, setOtherUsers, setSelectedUser } from '../../redux/userSlice'
import { debounce } from "lodash"
import { IoSearchSharp } from "react-icons/io5";
import { setChatType, setSelectedGroup, setUserGroup } from '../../redux/groupSlice'
import { MdGroups } from "react-icons/md";
import { globalSocket } from '../../App'
import { setNotifications, setSlideRightSide } from '../../redux/messageSlice'

const OtherUsers = () => {

    const { userGroups } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)
    const { otherUsers } = useSelector(store => store.user)
    const { selectedUser } = useSelector(store => store.user)
    const { loggedInUser } = useSelector(store => store.user)
    const { notifications } = useSelector(store => store.message)
    const [other_User, setOther_User] = useState();
    const { onlineUsers } = useSelector(store => store.socket)
    const inputRef = useRef(null)
    const dispatch = useDispatch()

    const getOtherUsers = async () => {

        const { data } = await axios(`/user/all`)
        dispatch(setOtherUsers(data?.data))

    }

    const getUserGroups = async () => {
        const { data } = await axios(`/group/getUserGroups?userId=${loggedInUser._id}`)
        // console.log(data.data);
        dispatch(setUserGroup(data?.data))

    }

    const handleSelectedUser = (e) => {
        dispatch(setSelectedUser(e))
        dispatch(setChatType("solo"))
        dispatch(setSelectedGroup(null))
        dispatch(setNotifications(notifications?.filter((elem) => (elem.senderId != e._id))))
        dispatch(setSlideRightSide("left-0"))
    }

    const handleGroupSelected = (elem) => {
        dispatch(setSelectedGroup(elem))
        dispatch(setChatType("group"))
        dispatch(setSlideRightSide("left-0"))
        // dispatch(setSelectedUser(null))

        // JOINING A GROUP OR CREATING IT
        globalSocket?.emit("group-selection", { groupId: elem?._id, groupName: elem?.groupName });

    }

    const handleDebounce = debounce(() => {

        console.log(inputRef.current.value);

        if (inputRef.current.value.length < 1) {
            setOther_User(otherUsers)
        } else {
            let a = otherUsers.filter((e) => e.userName.startsWith(inputRef.current.value))
            console.log(a);
            setOther_User(a)
        }

    }, 500)

    useEffect(() => {
        getOtherUsers();
        getUserGroups();
    }, [])

    useEffect(() => {
        setOther_User(otherUsers)
    }, [otherUsers])


    useEffect(() => {

        let a = notifications.filter((elem) => (elem.senderId == "6629e40cb5250daccc8b2c23")).length
        console.log(a);

    }, [notifications])


    return (
        <div className='bg-slate-900 h-full p-2 overflow-auto'>

            {/* SEARCH USER */}
            <div className='h-[7%] flex justify-between items-center p-2 gap-2 bg-white rounded-lg'>
                <input ref={inputRef} onChange={handleDebounce} className='w-[80%] text-black border-none outline-none' type="text" />
                <IoSearchSharp className='text-2xl text-black' />
            </div>


            <div className='h-[93%]'>

                {/* SHOW OTHER USERS MEANS YOUR FRINDS IN LEFT SIDE */}
                {other_User?.map((e) => (

                    <div onClick={() => handleSelectedUser(e)} key={e._id} className={`flex gap-2 items-center p-2 hover:bg-slate-600 cursor-pointer ${selectedUser?._id == e._id ? "bg-slate-600" : "transparent"} relative`}>

                        <div className='relative w-[40px]'>
                            <img className='w-[40px]' src={e.profilePic} alt="" srcSet="" />
                            {onlineUsers?.includes(e._id) && <span className='absolute top-0 right-0 bg-green-600 text-xl w-[8px] h-[8px] rounded-full'></span>}
                        </div>

                        <p className='capitalize'>{e.userName}</p>

                        <span className='absolute top-1 right-1'>{notifications.filter((elem) => (elem.senderId == e._id)).length > 0 ? <p className='w-[20px] h-[20px] rounded-full flex justify-center items-center text-[10px] bg-slate-700'>{notifications.filter((elem) => (elem.senderId == e._id)).length}</p> : ""}</span>

                    </div>

                ))}



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

            </div>

        </div>
    )
}

export default OtherUsers
