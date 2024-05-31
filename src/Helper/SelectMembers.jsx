import React, { useRef, useState } from 'react'
import { debounce } from 'lodash';
import { searchUserAsync, setSearchUserResult } from '../redux/userSlice';
import search from '../assets/search.svg'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios"
import { toast } from "react-toastify"
import { setSelectedGroup } from '../redux/groupSlice';

const SelectMembers = ({ group, hide }) => {

    const inputRef = useRef(null)
    const [selectedUser, setSelectedUser] = useState([])
    const [loader, setLoader] = useState(false)

    const { searchUserResult } = useSelector(store => store.user)
    const dispatch = useDispatch()

    const handleSelectingUser = (user) => {

        if (group.groupMembers.map((e) => e._id).includes(user._id) || selectedUser.map((e) => e._id).includes(user._id)) {
            toast("Member already present")
        } else {
            setSelectedUser((prev) => [...prev, user])
        }
    }

    const handleRemoveSelectedUser = (user) => {
        setSelectedUser(selectedUser.filter((e) => e._id != user._id))
    }

    const handleAddGroupMembers = async () => {

        setLoader(true)
        try {
            let res = await axios.post("/group/updateGroup", {
                type: "add",
                groupMembersToAdd: JSON.stringify(selectedUser.map((e) => e._id)),
                groupId: group?._id
            })

            if (res.status == 200) {
                hide()
                toast("ADDED")
                setLoader(false)
                dispatch(setSelectedGroup(res.data.data))
            } else {
                toast("NOT ADDED")
                setLoader(false)
            }

        } catch (error) {
            toast("NOT ADDED")
            setLoader(false)
        }



    }

    const handleDebounce = debounce(() => {

        if (inputRef.current.value.length < 1) {
            dispatch(setSearchUserResult({ loader: "idle", data: [] }))
        } else {
            dispatch(searchUserAsync({ query: inputRef.current.value }))
        }

    }, 500)

    return (
        <div className='bg-gray-500 w-[70%] h-[60vh] overflow-hidden p-2 fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-[20] flex flex-col gap-2'>

            <div className='w-full h-[5%]'>
                {selectedUser.map((e) => (<span key={e._id} onClick={() => handleRemoveSelectedUser(e)} className='p-1 cursor-pointer hover:text-red-900'>{e.userName},</span>))}
            </div>

            {/* SEARCH USER */}
            <div className='w-full h-[10%] flex justify-between items-center p-2 gap-2 bg-white rounded-lg'>

                <input ref={inputRef} onChange={handleDebounce} className='w-[80%] text-xl text-black border-none outline-none' type="text" placeholder='Search User...' />

                <img className='w-[30px]' src={search} alt="" srcSet="" />

            </div>


            {/* SHOWING SEARCH USER RESULT */}
            <div className='w-full flex flex-col gap-2 h-[70%] relative rounded-xl overflow-scroll bg-gray-600'>

                {searchUserResult.loader == "loading"
                    ?
                    <div className='h-full flex items-center justify-center'>Loading...</div>
                    :
                    <>
                        {searchUserResult.data?.length > 0
                            ?
                            <div className='flex flex-col gap-2 overflow-y-scroll'>
                                {searchUserResult.data.map((e) => (
                                    <div key={e._id} onClick={() => handleSelectingUser(e)} className='flex gap-2 cursor-pointer p-2 hover:bg-slate-600 rounded-lg'>

                                        <img className='w-[50px] h-[50px]' src={e.profilePic} alt="" srcSet="" />

                                        <p className='capitalize text-xl'>{e.userName}</p>

                                    </div>
                                ))}
                            </div>
                            :
                            <div className='h-full flex items-center justify-center'>NO USER</div>}
                    </>}

            </div>

            {!loader ? <div onClick={handleAddGroupMembers} className='w-full h-[10%] P-1 flex items-center justify-center bg-gray-400 rounded-lg'>ADD</div> : <div className='w-full h-[10%] P-1 flex items-center justify-center bg-gray-400 rounded-lg'>Adding... wait</div>}

        </div>
    )
}

export default SelectMembers
