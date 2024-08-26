import App from "@/App";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import NotFound from "@/pages/notFound/NotFound";
import Register from "@/pages/register/Register";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export default function AppRouter() {
    return (
        <Router>
            <App>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="dang-ky" element={<Register />} />
                    <Route path="dang-nhap" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </App>
        </Router>
    );
}
