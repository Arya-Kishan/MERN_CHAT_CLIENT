import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Navigate } from 'react-router-dom';


const Protected = ({ children }) => {

  const { loggedInUser } = useSelector(store => store.user)

  if (!loggedInUser) {
    return <Navigate to={"/login"} />
  }


  return (children)
}

export default Protected
