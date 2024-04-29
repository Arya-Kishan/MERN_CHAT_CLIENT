import React from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux"
import { Navigate, useNavigate } from 'react-router-dom'
import { setLoggedInUser } from '../../redux/userSlice'
import { toast } from "react-toastify"
import { IoLogoSnapchat } from "react-icons/io";


const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loggedInUser } = useSelector(store => store.user)

    const onSubmit = async (data) => {

        try {
            const res = await axios.post(`/user/login`, data)
            dispatch(setLoggedInUser(res.data.data))
        } catch (error) {
            console.log(error);
            toast("INVALID CREDENTIALS")
        }

    }

    return (
        <div className='flex flex-col justify-center items-center p-2 h-dvh'>

            {loggedInUser && <Navigate to='/' />}

            <IoLogoSnapchat className='text-6xl my-10'/>

            <h1 className='text-4xl'>LOGIN</h1>

            <form onSubmit={handleSubmit(onSubmit)} className='w-[80%] md:w-[30%] flex flex-col gap-5'>

                {/* USERNAME */}
                <div className='flex flex-col gap-1'>

                    <span className='text-2xl'>Name</span>

                    <input
                        type='text'
                        {...register("userName", {
                            required: {
                                value: true,
                                message: 'NAME IS REQUIRED'
                            },
                            minLength: {
                                value: 2,
                                message: 'NAME MUST GREATER THAN 5 CHARACTERS'
                            },
                        })}
                        className='text-black text-xl p-2 rounded-lg'
                    />

                    {errors?.userName && <span className='text-slate-600'>{errors.userName.message}</span>}

                </div>

                {/* PASSWORD */}
                <div className='flex flex-col gap-1'>

                    <span className='text-2xl'>Password</span>

                    <input
                        type='text'
                        {...register("password", {
                            required: {
                                value: true,
                                message: 'PASSWORD IS REQUIRED'
                            },
                            minLength: {
                                value: 1,
                                message: 'PASSWORD MUST GREATER THAN 5 CHARACTERS'
                            },
                        })}
                        className='text-black text-xl p-2 rounded-lg'
                    />

                    {errors?.password && <span className='text-slate-600'>{errors.password.message}</span>}

                </div>


                <button className='bg-teal-500 rounded-lg px-4 py-2' type="submit">LOGIN</button>

            </form>

            <p onClick={() => navigate("/signup")} className='mt-2'>Not a user, <span className='text-teal-500'>Sign Up</span></p>

        </div>
    )
}

export default Login
