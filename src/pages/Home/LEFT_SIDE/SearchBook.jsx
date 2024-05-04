import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import addUserWhite from '../../../assets/addUserWhite.svg'
import { toast } from 'react-toastify';
import { searchUserAsync, setSearchUserResult } from '../../../redux/userSlice';
import allUser from "../../../assets/allUser.svg"
import { useDispatch, useSelector } from 'react-redux';

const SearchBook = () => {

    const inputRef = useRef(null)

    const [showAll, setShowAll] = useState(false);

    const dispatch = useDispatch()


    const { searchUserResult } = useSelector(store => store.user)

    const [showOtherUserProfile, setShowOtherUserProfile] = useState({ user: null, show: false });


    const handleMakeFriend = async (user) => {

        toast("Adding Friend")
        const res = await axios.post("/user/addFriend", {
            senderRequestUserId: loggedInUser._id,
            receiverRequestUserId: user._id
        })

        if (res.status == 200) {
            dispatch(addFriends(res?.data?.data))
            inputRef.current.value = "";
            setShowOtherUserProfile({ user: null, show: false })
            toast("Added")
        } else {
            toast("Error Occured")
        }


        console.log(res.data.data);

    }



    const handleDebounce = debounce(() => {

        console.log(inputRef.current.value);

        if (inputRef.current.value.length < 1) {
            dispatch(setSearchUserResult({ loader: "idle", data: [] }))
        } else {
            dispatch(searchUserAsync({ query: inputRef.current.value }))
        }

    }, 500)


    useEffect(() => {
        if (showAll) {
            dispatch(searchUserAsync({ query: "" }))
        } else {
            dispatch(setSearchUserResult({ loader: "idle", data: [] }))
        }
    }, [showAll])



    return (
        <>


            {/* SEARCH USER */}
            <div className='w-full h-[7%] flex justify-between items-center p-2 gap-2 bg-white rounded-lg'>

                <input ref={inputRef} onChange={handleDebounce} className='w-[80%] text-xl text-black border-none outline-none' type="text" placeholder='Search User...' />

                <img className='w-[40px]' src={addUserWhite} alt="" srcset="" />

            </div>


            {/* SHOWING SEARCH USER RESULT */}
            <div className='w-full flex flex-col gap-2 p-2 pb-10 mt-2 h-[90%] relative rounded-xl'>

                {searchUserResult.loader == "loading"
                    ?
                    <div className='h-full flex items-center justify-center'>Loading...</div>
                    :
                    <>
                        {searchUserResult.data.length > 0
                            ?
                            <div className='flex flex-col gap-2 overflow-y-scroll'>
                                {searchUserResult.data.map((e) => (
                                    <div key={e._id} onClick={() => setShowOtherUserProfile({ user: e, show: true })} className='flex gap-2 cursor-pointer p-2 hover:bg-slate-600 rounded-lg'>

                                        <img className='w-[50px] h-[50px]' src={e.profilePic} alt="" srcSet="" />

                                        <p className='capitalize text-xl'>{e.userName}</p>

                                    </div>
                                ))}
                            </div>
                            :
                            <div className='h-full flex items-center justify-center'>NO USER</div>}
                    </>}


                <div onClick={() => setShowAll(!showAll)} className='absolute top-[86%] md:top-[90%] right-5 md:right-3 cursor-pointer bg-slate-800 rounded-full border-2 border-white p-2 shadow-sm shadow-white'>

                    {!showAll ? <img className='w-[30px] md:w-[20px]' src={allUser} alt="" srcset="" /> : <img className='w-[30px]' src={allUser} alt="" srcset="" />}


                </div>


            </div>



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


        </>
    )
}

export default SearchBook
