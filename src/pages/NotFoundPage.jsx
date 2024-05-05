import React from 'react'
import notFound from '../assets/notFound.svg'

const NotFoundPage = () => {
    return (
        <div className='w-full h-dvh flex flex-col justify-center items-center'>

            <img className='w-[60%] md:w-[40%]'src={notFound} alt="" srcSet="" />
            <p className='text-4xl font-bold'>NOT FOUND</p>

        </div>
    )
}

export default NotFoundPage
