import axios from 'axios'
import React, { useEffect } from 'react'
import { setChatType, setSelectedGroup, setUserGroup } from '../../../redux/groupSlice'
import { setMessages, setSlideRightSide } from '../../../redux/messageSlice'
import { globalSocket } from '../../../App'
import { useDispatch, useSelector } from 'react-redux'
import groupWhite from '../../../assets/groupWhite.svg'

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

            <div className='h-full flex flex-col gap-2'>
                {
                    userGroups?.length > 0 ? userGroups?.map((elem) => (
                        <div
                            key={elem._id}
                            onClick={() => handleGroupSelected(elem)}
                            className={`flex gap-2 ${selectedGroup?._id == elem._id ? "bg-slate-600" : "transparent"} hover:bg-slate-600 cursor-pointer p-2`}>

                            <img className='w-[30px]' src={groupWhite} alt="" srcSet="" />

                            <p className='capitalize p-2 text-xl'>{elem.groupName}</p>

                        </div>
                    )) : <div className='w-full h-full flex justify-center items-center'>NO GROUPS</div>
                }
            </div>
        </>
    )
}

export default GroupChat
