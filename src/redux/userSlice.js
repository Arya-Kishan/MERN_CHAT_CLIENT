import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
  loggedInUser: null,
  loggedInUserId: null,
  selectedUser: null,
  searchUserResult: { loader: "idle", data: [] },
  friends: [],
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
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload,
        state.loggedInUserId = action.payload?._id
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setSearchUserResult: (state, action) => {
      state.searchUserResult = action.payload
    },
    addFriends: (state, action) => {
      state.loggedInUser.friends.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUserAsync.pending, (state) => {
        state.searchUserResult = { loader: "loading", data: [] };
      })
      .addCase(searchUserAsync.fulfilled, (state, action) => {
        state.searchUserResult = { loader: "idle", data: action.payload };
      })
      .addCase(searchUserAsync.rejected, (state, action) => {
        state.searchUserResult = { loader: "idle", data: [] };
      })
  },
})

export const { setLoggedInUser, setSelectedUser, addFriends, setSearchUserResult } = userSlice.actions

export default userSlice.reducer