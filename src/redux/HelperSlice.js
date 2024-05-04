import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    addBtn: false,
}

export const helperSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setAdd: (state, action) => {
            state.addBtn = action.payload
        },
    },
})

export const { setAdd } = helperSlice.actions

export default helperSlice.reducer