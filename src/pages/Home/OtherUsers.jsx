import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOtherUsers, setSelectedUser } from '../../redux/userSlice'

const OtherUsers = () => {

    const { otherUsers } = useSelector(store => store.user)
    const dispatch = useDispatch()

    const getOtherUsers = async () => {

        const { data } = await axios(`/user/all`)
        console.log(data);
        dispatch(setOtherUsers(data?.data))

    }

    const handleSelectedUser = (e) => {
        dispatch(setSelectedUser(e))
    }

    useEffect(() => {
        getOtherUsers();
    }, [])

    return (
        <div>

            {otherUsers?.map((e) => (

                <div onClick={() => handleSelectedUser(e)} key={e._id} className='flex gap-2 items-center p-2 bg-slate-500'>

                    <div className='w-[40px] h-[40px]'>
                        <img className='w-[40px]' src={e.profilePic} alt="" srcSet="" />
                    </div>

                    <p>{e.userName}</p>

                </div>

            ))}

        </div>
    )
}

export default OtherUsers
