import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: "arya",
  messages: [],
  // STORE THE MESSAGES WHICH ARE UNSEEN
  notifications: [],
  // BELOW STATE USED SLIDE RIGHT SIDE BAR IN MOBILE DEVICE AS IN MOBILE DEBICE RIGHT SIDE IS FIXED POSITION
  slideRightSide: "left-full",
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    setNotifications: (state, action) => {
      state.notifications = (action.payload)
    },
    addNotifications: (state, action) => {
      state.notifications.push(action.payload)
    },
    setSlideRightSide: (state, action) => {
      state.slideRightSide = (action.payload)
    },
  },
})

export const { setMessages, setNotifications, addNotifications, setSlideRightSide } = messageSlice.actions

export default messageSlice.reducer