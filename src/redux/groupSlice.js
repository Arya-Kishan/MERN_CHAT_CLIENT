import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    userGroups: null,
    selectedGroup: null,
    chatType: null,
}


export const createGroupAsync = createAsyncThunk(
    'group/createGroup',
    async ({ query }, { rejectWithValue }) => {
        console.log(query);
        try {
            const response = await axios.post(`/group/create`, query)
            console.log(response);
            console.log(response?.data?.data);
            return response?.data?.data;
        } catch (error) {
            return null;
        }
    }
);




export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setUserGroup: (state, action) => {
            state.userGroups = action.payload
        },
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload
        },
        setChatType: (state, action) => {
            state.chatType = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGroupAsync.pending, (state) => {
                // state.userGroups = [];
            })
            .addCase(createGroupAsync.fulfilled, (state, action) => {
                state.userGroups.push(action.payload);
            })
            .addCase(createGroupAsync.rejected, (state, action) => {
                // state.userGroups = [];
            })
    },
})

export const { setUserGroup, setSelectedGroup, setChatType } = groupSlice.actions

export default groupSlice.reducer