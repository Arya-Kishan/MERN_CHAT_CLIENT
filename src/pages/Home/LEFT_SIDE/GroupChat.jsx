import axios from 'axios'
import React, { useEffect } from 'react'
import { setChatType, setSelectedGroup, setUserGroup } from '../../../redux/groupSlice'
import { setLoggedInUser } from '../../../redux/userSlice'
import { setMessages, setSlideRightSide } from '../../../redux/messageSlice'

const GroupChat = () => {

    const { userGroups } = useSelector(store => store.group)

    const getUserGroups = async () => {
        const { data } = await axios(`/group/getUserGroups?userId=${setLoggedInUser._id}`)
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
