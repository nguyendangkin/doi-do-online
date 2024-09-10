import axios from "axios";
import { store } from "@/redux/store";

// Tạo một instance của Axios với các config mặc định
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 2500, // Thiết lập timeout mặc định
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    withCredentials: true,
});

// Thêm Authorization token vào headers nếu có
const AUTH_TOKEN = "your-auth-token"; // Thay thế bằng token của bạn
axiosInstance.defaults.headers.common["Authorization"] = AUTH_TOKEN;

// Thêm request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Làm gì đó trước khi gửi request
        const accessToken = (store.getState().auth.users as any)?.access_token;

        // Nếu có access token, thêm vào header
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        // Làm gì đó với lỗi khi gửi request
        return Promise.reject(error);
    }
);

// Thêm response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Làm gì đó với dữ liệu response
        return response;
    },
    (error) => {
        // Làm gì đó với lỗi khi nhận response
        return Promise.reject(error.response.data.message);
    }
);

export default axiosInstance;
