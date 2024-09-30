import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authSlice from "@/redux/authSlice";
import userSlice from "@/redux/userSlice";

// Cấu hình persist cho authSlice và userSlice
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"], // Chỉ định những reducer nào cần được persist
};

// Kết hợp các reducer
const rootReducer = combineReducers({
    auth: authSlice,
    user: userSlice,
});

// Tạo persisted reducer cho toàn bộ ứng dụng
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
