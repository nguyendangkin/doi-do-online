import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { store } from "@/redux/store";

// Tạo một instance của Axios với các config mặc định
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 2500,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    withCredentials: true,
});

// Thêm request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = (store.getState().auth.user as any)?.access_token;
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi là 402 và chưa thử refresh token
        if (error.response.status === 402 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Gọi API refresh token
                const response = await axios.post(
                    "http://localhost:3000/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );

                const { access_token } = response.data;

                // Cập nhật access token mới vào Redux store
                store.dispatch(setUser({ access_token }));

                // Cập nhật token mới cho request hiện tại
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${access_token}`;

                // Thử lại request ban đầu với token mới
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Xử lý lỗi khi refresh token thất bại (ví dụ: đăng xuất người dùng)
                console.error("Không thể làm mới token:", refreshError);
                // Thêm logic đăng xuất ở đây nếu cần
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error.response?.data?.message || error);
    }
);

export default axiosInstance;
