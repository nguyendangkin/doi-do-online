import DefaultLayout from "@/components/layout/DefaultLayout";
import LoginLayout from "@/components/layout/LoginLayout";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface AppProps {
    children: ReactNode;
}

export default function App({ children }: AppProps) {
    const location = useLocation();

    const renderLayout = () => {
        switch (location.pathname) {
            case "/dang-nhap":
                return <LoginLayout>{children}</LoginLayout>;
            case "/dang-ky":
                return <LoginLayout>{children}</LoginLayout>;
            default:
                return <DefaultLayout>{children}</DefaultLayout>;
        }
    };

    return <>{renderLayout()}</>;
}
