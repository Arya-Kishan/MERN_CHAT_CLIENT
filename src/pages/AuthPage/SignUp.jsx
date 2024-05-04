import React, { useState } from 'react'
import axios from "axios";
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { setLoggedInUser } from '../../redux/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { IoLogoSnapchat } from "react-icons/io";
import loader from "../../assets/loader.svg"


const SignUp = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [signUpLoader, setSignUpLoader] = useState(false)

    // const {value} = useSelector(store=>store.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { loggedInUser } = useSelector(store => store.user)


    const onSubmit = async (data) => {
        setSignUpLoader(true)
        const res = await axios.post(`/user/register`, data)
        console.log(res);
        dispatch(setLoggedInUser(res.data.data))
        setSignUpLoader(false)
    }

    return (
        <div className='h-dvh flex flex-col justify-center items-center p-2 relative'>
            {loggedInUser && <Navigate to='/' />}

            <IoLogoSnapchat className='text-6xl my-8' />


            <h1 className='text-4xl'>SIGN UP</h1>

            <form onSubmit={handleSubmit(onSubmit)} className='w-[80%] md:w-[30%] flex flex-col gap-5 m-2'>

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
                                value: 3,
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

                {/* GENDER */}
                <div className='flex flex-col gap-1'>

                    <span className='text-2xl'>Gender</span>

                    <div className='flex justify-evenly gap-2'>
                        <label htmlFor="male">
                            <input
                                {...register("gender")}
                                type="radio"
                                value="male"
                                id="male"
                            />
                            <span className='pl-2 text-xl'>Male</span>
                        </label>

                        <label htmlFor="female">
                            <input
                                {...register("gender")}
                                type="radio"
                                value="female"
                                id="female"
                            />
                            <span className='pl-2 text-xl'>Female</span>
                        </label>
                    </div>

                </div>


                <button disabled={signUpLoader} className='bg-teal-500 rounded-lg px-4 py-2' type="submit">REGISTER</button>

            </form>

            <p onClick={() => navigate("/login")} className='mt-2'>Already a user, <span className='text-teal-500'>Login</span></p>

            {signUpLoader && <img className='w-[40px] absolute top-[10%] left-[50%] -translate-x-[50%] -translate-y-[50%]' src={loader} alt="" srcSet="" />}

        </div>
    )
}

export default SignUp
