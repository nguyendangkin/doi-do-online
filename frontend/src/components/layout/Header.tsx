import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaBoxes, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="">
            <div className="flex p-1 items-center">
                <h1 className="border text-center rounded font-semibold pr-1">
                    <span className="flex items-center">
                        Đổi Hàng Tốt
                        <FaBoxes />
                    </span>
                </h1>
                <div className="flex w-[100%]">
                    <Input className="mr-1 ml-1 " />
                    <Button variant="outline" className="mr-1">
                        <FaSearch />
                    </Button>
                </div>
                <div className="flex">
                    <Button asChild variant="outline" className="mr-1">
                        <Link to="/dang-ky">Đăng ký</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/dang-nhap">Đăng nhập</Link>
                    </Button>
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
