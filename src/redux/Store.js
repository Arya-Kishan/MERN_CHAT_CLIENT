import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import messageReducer from './messageSlice'
import socketReducer from './socketSlice'
import groupReducer from './groupSlice'
import helperReducer from './HelperSlice'

export const store = configureStore({
  reducer: {
    user:userReducer,
    message:messageReducer,
    socket:socketReducer,
    group:groupReducer,
    helper:helperReducer,
  },
})