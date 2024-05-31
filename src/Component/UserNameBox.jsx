import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setSelectedGroup } from '../redux/groupSlice';

const userNameBox = ({ user }) => {

    const { selectedGroup } = useSelector(store => store.group)
    const { loggedInUserId } = useSelector(store => store.user)

    const dispatch = useDispatch()

    const handleRemoveUser = async () => {
        console.log(user);
        console.log(selectedGroup);

        try {

            let res = await axios.post("/group/updateGroup", {
                type: "remove",
                groupMemberToRemove: user._id,
                groupId: selectedGroup?._id
            })

            if (res.status == 200) {
                toast("REMOVED")
                dispatch(setSelectedGroup(res.data.data))
            } else {
                toast("NOT ADDED")
            }

        } catch (error) {
            toast("NOT REMOVED")
            console.log(error);
        }

    }


    return (
        <>
            {user && <div className='w-full flex gap-2 items-center justify-between'>

                <div className='flex items-center'>
                    <img className='w-[50px] h-[50px]' src={user.profilePic} alt="" srcSet="" />

                    <span className='text-xl'>{user.userName}</span>
                </div>

                {loggedInUserId == selectedGroup.groupCreatedBy._id && <span onClick={() => handleRemoveUser()}>Remove</span>}

            </div>}
        </>
    )
}

export default userNameBox
