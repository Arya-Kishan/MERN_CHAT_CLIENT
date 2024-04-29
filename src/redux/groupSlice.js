import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userGroups: null,
    selectedGroup: null,
    chatType: null,
}

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
})

export const { setUserGroup, setSelectedGroup, setChatType } = groupSlice.actions

export default groupSlice.reducer