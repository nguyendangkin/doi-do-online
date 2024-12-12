import App from "@/App";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import MyStore from "@/pages/myStore/MyStore";
import NotFound from "@/pages/notFound/NotFound";
import Register from "@/pages/register/Register";
import Setting from "@/pages/setting/Setting";
import ProtectedRoute from "@/router/ProtectedRoute";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export default function AppRouter() {
    return (
        <Router>
            <App>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="dang-ky"
                        element={
                            <ProtectedRoute>
                                <Register />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="dang-nhap"
                        element={
                            <ProtectedRoute>
                                <Login />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="cai-dat"
                        element={
                            <ProtectedRoute>
                                <Setting />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="kho-cua-toi"
                        element={
                            <ProtectedRoute>
                                <MyStore />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </App>
        </Router>
    );
}
