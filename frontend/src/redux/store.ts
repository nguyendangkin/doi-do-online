import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authSlice from "@/redux/authSlice";
import userSlice from "@/redux/userSlice";
import postsSlice from "@/redux/postsSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const rootReducer = combineReducers({
    auth: authSlice,
    user: userSlice,
    post: postsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/PURGE",
                ],
            },
        }),
});

export const persistor = persistStore(store);
