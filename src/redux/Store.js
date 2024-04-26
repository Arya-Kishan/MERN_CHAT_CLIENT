import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import messageReducer from './messageSlice'
import socketReducer from './socketSlice'

export const store = configureStore({
  reducer: {
    user:userReducer,
    message:messageReducer,
    socket:socketReducer,
  },
})