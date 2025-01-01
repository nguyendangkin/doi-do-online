import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: null,
};

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
    },
});

export const { setPosts } = postsSlice.actions;

export default postsSlice.reducer;
