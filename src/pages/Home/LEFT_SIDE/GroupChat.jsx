import axios from 'axios'
import React, { useEffect } from 'react'
import { setChatType, setSelectedGroup, setUserGroup } from '../../../redux/groupSlice'
import { setMessages, setSlideRightSide } from '../../../redux/messageSlice'
import { globalSocket } from '../../../App'
import { MdGroups } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'

const GroupChat = () => {

    const { userGroups } = useSelector(store => store.group)
    const { selectedGroup } = useSelector(store => store.group)
    const { loggedInUser } = useSelector(store => store.user)

    const dispatch = useDispatch()


    const getUserGroups = async () => {
        const { data } = await axios(`/group/getUserGroups?userId=${loggedInUser._id}`)
        // console.log(data.data);
        dispatch(setUserGroup(data?.data))

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



    useEffect(() => {
        getUserGroups();
    }, [])

    return (
        <>

            <h1 className='text-3xl'>GROUP CHAT</h1>

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
        </>
    )
}

export default GroupChat
