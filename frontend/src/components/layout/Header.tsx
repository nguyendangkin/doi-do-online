import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaBoxes, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/axios/axiosConfig";
import { logout } from "@/redux/authSlice";
import { persistor } from "@/redux/store";
import { useState, useEffect } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUserInfo } from "@/redux/userSlice";
import { useDebounce } from "@/customsHooks/useDebounce";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const accessToken = useSelector(
        (state: any) => state?.auth?.user?.access_token
    );

    useEffect(() => {
        if (debouncedSearchTerm) {
            setSearchParams({ q: debouncedSearchTerm });
        } else {
            searchParams.delete("q");
            setSearchParams(searchParams);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        if (accessToken) {
            const fetchUserData = async () => {
                try {
                    const response = await axiosInstance.get(`/user/profile`);
                    dispatch(setUserInfo(response.data));
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, []);

    const avatarUrl = useSelector((state: any) => state?.user?.user?.avatarUrl);
    const hostApi = import.meta.env.VITE_API_URL;

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            dispatch(logout());
            await persistor.purge();
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchParams({ q: searchTerm });
        }
    };

    return (
        <header className="">
            <div className="flex p-1 items-center">
                <Button
                    asChild
                    className="border text-center rounded font-semibold p-4 mr-1"
                >
                    <Link to={"/"} className="flex items-center">
                        <span className="mr-2">Đổi Hàng Tốt</span>
                        <FaBoxes />
                    </Link>
                </Button>
                <form onSubmit={handleSearch} className="flex w-[100%] gap-1">
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                    <Button type="submit" variant="outline">
                        <FaSearch />
                    </Button>
                </form>
                <div className="flex gap-1 ml-3">
                    {accessToken ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            `${hostApi}${avatarUrl}` ||
                                            "https://github.com/shadcn.png"
                                        }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    Quản lý tài khoản
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={"/cai-dat"}>Cài đặt</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={"/kho-cua-toi"}>Kho của tôi</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={"/kenh-chat"}>Kênh chát</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild variant="outline">
                            <Link to="/dang-ky">Đăng ký</Link>
                        </Button>
                    )}
                    {accessToken ? (
                        <Button onClick={handleLogout} variant="outline">
                            Đăng xuất
                        </Button>
                    ) : (
                        <Button asChild variant="outline">
                            <Link to="/dang-nhap">Đăng nhập</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
