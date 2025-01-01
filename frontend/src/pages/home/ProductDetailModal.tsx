import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    ZoomIn,
    ZoomOut,
    X,
} from "lucide-react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

interface Post {
    id: number;
    content: string;
    images: string[];
    user: {
        email: string;
    };
    tag: string;
    createdAt: string;
}

interface ProductDetailModalProps {
    post: Post;
    isOpen: boolean;
    onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    post,
    isOpen,
    onClose,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const hostApi = import.meta.env.VITE_API_URL;

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === post.images.length - 1 ? 0 : prev + 1
        );
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? post.images.length - 1 : prev - 1
        );
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    const handleChatWithSeller = () => {
        console.log("Opening chat with:", post.user.email);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full p-0">
                <DialogTitle asChild>
                    <div className="relative">
                        <h2 className="text-xl font-semibold px-6 pt-6">
                            Chi tiết sản phẩm
                        </h2>
                        <button
                            className="absolute top-2 right-2 z-50 bg-black/50 p-2 rounded-full hover:bg-black/70"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4 text-white" />
                        </button>
                    </div>
                </DialogTitle>

                {/* Thêm DialogDescription */}
                <DialogDescription className="sr-only">
                    Xem chi tiết sản phẩm và hình ảnh
                </DialogDescription>

                {/* Main Content */}
                <div className="relative flex flex-col lg:flex-row max-h-[90vh]">
                    {/* Image Section */}
                    <div className="relative w-full lg:w-2/3 h-[400px] lg:h-[600px]">
                        <div
                            className={`relative h-full ${
                                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                            }`}
                        >
                            <img
                                src={hostApi + post.images[currentImageIndex]}
                                alt={`Product ${currentImageIndex + 1}`}
                                className={`w-full h-full object-contain transition-transform duration-300 ${
                                    isZoomed ? "scale-150" : "scale-100"
                                }`}
                                onClick={toggleZoom}
                            />
                        </div>

                        {post.images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70"
                                    onClick={previousImage}
                                >
                                    <ChevronLeft className="h-6 w-6 text-white" />
                                </button>
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="h-6 w-6 text-white" />
                                </button>
                            </>
                        )}

                        <button
                            className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70"
                            onClick={toggleZoom}
                        >
                            {isZoomed ? (
                                <ZoomOut className="h-4 w-4 text-white" />
                            ) : (
                                <ZoomIn className="h-4 w-4 text-white" />
                            )}
                        </button>

                        {/* Image Navigation Thumbnails */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {post.images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${
                                        currentImageIndex === index
                                            ? "bg-white"
                                            : "bg-white/50"
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-1/3 p-6 overflow-y-auto">
                        <div className="prose max-w-none">
                            <p className="text-lg mb-4">{post.content}</p>

                            <div className="flex flex-col space-y-2 text-sm text-gray-500">
                                <p>Đăng bởi: {post.user.email}</p>
                                <p>
                                    Ngày đăng:{" "}
                                    {new Date(
                                        post.createdAt
                                    ).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <Button
                                className="w-full mt-6 flex items-center justify-center gap-2"
                                onClick={handleChatWithSeller}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Chat với người bán
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailModal;
