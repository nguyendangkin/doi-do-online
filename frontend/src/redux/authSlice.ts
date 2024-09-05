import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload.user;
        },
        logout: (state) => {
            state.users = null;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setUsers, logout } = authSlice.actions;

export default authSlice.reducer;
