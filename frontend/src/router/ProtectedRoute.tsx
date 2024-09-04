import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = useSelector(
        (state: any) => state.auth.users?.access_token
    );

    useEffect(() => {
        if (
            accessToken &&
            (location.pathname === "/dang-ky" ||
                location.pathname === "/dang-nhap")
        ) {
            // If there's an accessToken and the path is /dang-ky or /dang-nhap, redirect to /
            navigate("/");
        }
    }, [accessToken, location.pathname, navigate]);

    // Render the children if the conditions are not met
    return <>{children}</>;
}
