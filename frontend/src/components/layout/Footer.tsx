import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Footer() {
    return (
        <footer className={cn("bg-gray-900 text-white py-8")}>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm md:text-base">
                    © 2024 ĐỔI HÀNG TỐT. Mọi quyền được bảo lưu.
                </div>
                <div className="mt-4 md:mt-0">
                    <Button variant="link" className="text-white mr-4">
                        Chính Sách Bảo Mật
                    </Button>
                    <Button variant="link" className="text-white mr-4">
                        Điều Khoản Và Dịch Vụ
                    </Button>
                    <Button variant="link" className="text-white">
                        Kết Nối Với Chúng Tôi
                    </Button>
                </div>
            </div>
        </footer>
    );
}
