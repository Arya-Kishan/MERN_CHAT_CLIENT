import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: "arya",
  loggedInUser:null,
  loggedInUserId:null,
  otherUsers:null,
  selectedUser:null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedInUser: (state,action) => {
      state.loggedInUser = action.payload,
      state.loggedInUserId = action.payload._id
    },
    setOtherUsers: (state,action) => {
      state.otherUsers = action.payload
    },
    setSelectedUser: (state,action) => {
      state.selectedUser = action.payload
    },
  },
})

export const { setLoggedInUser, setOtherUsers, setSelectedUser } = userSlice.actions

export default userSlice.reducer