import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaBoxes, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "@/redux/store";
import { logout } from "@/redux/authSlice";

export default function Header() {
    const dispatch = useDispatch();
    const accessToken = useSelector(
        (state: any) => state.auth.users?.access_token
    );

    const handleLogout = async () => {
        await persistor.purge();
        dispatch(logout());
    };

    return (
        <header className="">
            <div className="flex p-1 items-center">
                <h1 className="border text-center rounded font-semibold pr-1">
                    <span className="flex items-center">
                        Đổi Hàng Tốt
                        <FaBoxes />
                    </span>
                </h1>
                <div className="flex w-[100%] gap-1">
                    <Input />
                    <Button variant="outline">
                        <FaSearch />
                    </Button>
                </div>
                <div className="flex gap-1 ml-3">
                    {accessToken ? (
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
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
