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

// Action creators are generated for each case reducer function
export const { setUserInfo } = authSlice.actions;

export default authSlice.reducer;
