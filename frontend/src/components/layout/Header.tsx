import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaBoxes, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/axios/axiosConfig";
import { logout } from "@/redux/authSlice";
import { persistor } from "@/redux/store";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector(
        (state: any) => state?.auth?.user?.access_token
    );

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
                <div className="flex w-[100%] gap-1">
                    <Input />
                    <Button variant="outline">
                        <FaSearch />
                    </Button>
                </div>
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
                                <DropdownMenuItem>Kho của tôi</DropdownMenuItem>
                                <DropdownMenuItem>
                                    Đẩy hàng lên kho
                                </DropdownMenuItem>
                                <DropdownMenuItem>Phòng chát</DropdownMenuItem>
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

            <div className="border">
                <ul className="flex overflow-x-scroll">
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Thiết Bị Điện Tử
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Phương Tiện Duy Chuyển
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Văn Phòng Phẩm
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Sách Vở
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Dụng Cụ Nhà Cửa
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Thiết Bị Điện Tử
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Phương Tiện Duy Chuyển
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Văn Phòng Phẩm
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Sách Vở
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Dụng Cụ Nhà Cửa
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Thiết Bị Điện Tử
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Phương Tiện Duy Chuyển
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Văn Phòng Phẩm
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Sách Vở
                        </Button>
                    </li>
                    <li>
                        <Button variant={"outline"} className="m-1">
                            Dụng Cụ Nhà Cửa
                        </Button>
                    </li>
                </ul>
            </div>
        </header>
    );
}
