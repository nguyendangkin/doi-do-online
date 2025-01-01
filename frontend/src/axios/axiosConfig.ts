import axios from "axios";
import { store } from "@/redux/store";
import { setUser, logout } from "@/redux/authSlice";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 2500,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    withCredentials: true,
});

const handleLogout = async () => {
    try {
        store.dispatch(logout());
        await axiosInstance.get("/auth/logout");
        window.location.href = "/dang-nhap";
    } catch (error) {
        console.log(error);
    }
};

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
        if (error.response.status === 402 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    "http://localhost:3000/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );

                const { access_token } = response.data;

                store.dispatch(setUser({ access_token }));

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${access_token}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Không thể làm mới token:", refreshError);
                handleLogout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error.response?.data?.message || error);
    }
);

export default axiosInstance;
