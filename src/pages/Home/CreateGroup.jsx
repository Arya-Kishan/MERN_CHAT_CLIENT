import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { searchUserAsync } from '../../redux/userSlice'
import { debounce } from 'lodash'
import axios from 'axios'

const CreateGroup = ({ setShowCreateGroup }) => {

    const { loggedInUser } = useSelector(store => store.user)
    const { searchUserResult } = useSelector(store => store.user)
    const [userArr, setUserArr] = useState([])
    const [selectedUserArr, setSelectedUserArr] = useState([])
    const dispatch = useDispatch()
    const inputRef1 = useRef(null)

    const searchUser = debounce((e) => {

        console.log(e.target.value);
        dispatch(searchUserAsync({ query: e.target.value }))

    }, 1000)

    const selectAddingUser = (user) => {
        setSelectedUserArr([...selectedUserArr, user])
    }

    const removeSelectedUser = (user) => {
        let a = selectedUserArr.filter((e) => e != user)
        console.log(a);
        setSelectedUserArr(a)
    }

    const createGroup = async () => {

        console.log(inputRef1.current.value);
        let selectedUser_Arr_id = selectedUserArr.map((e) => (e._id))
        console.log(selectedUser_Arr_id);

        const res = await axios.post(`http://localhost:8080/api/v1/group/create`, {
            groupName: inputRef1.current.value,
            groupCreatedBy: loggedInUser._id,
            groupMembers: JSON.stringify(selectedUser_Arr_id)
        })

        setShowCreateGroup(false)

    }

    useEffect(() => {
        setUserArr(searchUserResult)
    }, [searchUserResult])


    return (
        <div onClick={() => setShowCreateGroup(false)} className='w-full h-full bg-gradient-to-r from-black fixed top-0 left-0 flex justify-center items-center z-10'>

            <div onClick={e => e.stopPropagation()} className='w-[50%] bg-slate-500'>

                <div className='flex flex-col gap-2 p-4'>

                    <h1 className='text-2xl font-bold text-center p-2'>Create Group Chat</h1>

                    {/* WRITE GROUP NAME */}
                    <input ref={inputRef1} type="text" className='border-none outline-none text-black rounded-md p-2' placeholder='Group Name...' />

                    {/* SHOWING SELECTED USER */}
                    <div className='flex gap-1 flex-wrap'>
                        {selectedUserArr.map((e) => (
                            <p key={e._id} onClick={() => removeSelectedUser(e)} className='bg-slate-800  rounded-lg p-2'>{e.userName}</p>
                        ))}
                    </div>

                    {/* SEARCH USER WITH DEBOUNCE */}
                    <input onChange={searchUser} type="text" className='border-none outline-none text-black rounded-md p-2' placeholder='Add Member...' />

                    {/* SEARCH USER RESULT */}
                    <div className='overflow-scroll h-[40vh] bg-black flex flex-col gap-2 p-2 rounded-lg'>
                        {userArr?.map((e) => (<div onClick={() => selectAddingUser(e)} key={e._id} className='p-2 bg-slate-800 rounded-lg'>{e.userName}</div>))}
                    </div>

                    <div className='text-end p-2'>
                        <span onClick={createGroup} className='bg-slate-500 p-2 rounded-lg font-semibold'>Create Chat</span>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default CreateGroup
