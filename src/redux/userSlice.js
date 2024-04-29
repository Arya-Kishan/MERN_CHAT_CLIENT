import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
  value: "arya",
  loggedInUser:null,
  loggedInUserId:null,
  otherUsers:null,
  selectedUser:null,
  searchUserResult:[],
}


export const searchUserAsync = createAsyncThunk(
  'user/searchUser',
  async ({ query }, { rejectWithValue }) => {
    console.log(query);
    try {
      const response = await axios(`/user/search?search=${query}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
);


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedInUser: (state,action) => {
      state.loggedInUser = action.payload,
      state.loggedInUserId = action.payload?._id
    },
    setOtherUsers: (state,action) => {
      // SHOW OTHERS USER WITHOUT THE LOGGED IN USER
      state.otherUsers = action.payload.filter((e)=>e._id != state.loggedInUserId)
    },
    setSelectedUser: (state,action) => {
      state.selectedUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUserAsync.pending, (state) => {
        state.searchUserResult = [];
      })
      .addCase(searchUserAsync.fulfilled, (state, action) => {
        state.searchUserResult = action.payload;
      })
      .addCase(searchUserAsync.rejected, (state, action) => {
        state.searchUserResult = [];
      })
  },
})

export const { setLoggedInUser, setOtherUsers, setSelectedUser } = userSlice.actions

export default userSlice.reducer