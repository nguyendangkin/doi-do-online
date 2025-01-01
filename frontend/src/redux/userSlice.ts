import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

export const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { setUserInfo } = authSlice.actions;

export default authSlice.reducer;
