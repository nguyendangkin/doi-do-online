import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface Post {
    id: number;
    content: string;
    images: string[];
}

interface DialogViewEditPostProps {
    post: Post;
    open: boolean;
    onClose: () => void;
    onSave: (updatedPost: Post) => void;
}

const DialogViewEditPost: React.FC<DialogViewEditPostProps> = ({
    post,
    open,
    onClose,
    onSave,
}) => {
    const [content, setContent] = useState(post.content);
    const [images, setImages] = useState(post.images);
    const [error, setError] = useState<string>("");

    const hostApi = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setContent(post.content);
        setImages(post.images);
    }, [post]);

    const handleImageChange = (newImages: FileList) => {
        if (newImages) {
            const fileArray = Array.from(newImages);

            // Kiểm tra nếu tổng số ảnh hiện tại và ảnh mới vượt quá giới hạn 10
            if (images.length + fileArray.length > 10) {
                setError("Chỉ được tải lên tối đa 10 ảnh.");
                return;
            }

            // Sử dụng URL.createObjectURL để tạo URL xem trước
            const imageUrls = fileArray.map((file) =>
                URL.createObjectURL(file)
            );
            setImages((prev) => [...prev, ...imageUrls]);
            setError(""); // Xóa thông báo lỗi nếu có
        }
    };

    const handleSave = () => {
        if (!content.trim() || images.length === 0) {
            setError("Vui lòng nhập nội dung và ít nhất một hình ảnh.");
            return;
        }
        onSave({ ...post, content, images });
        onClose();
    };

    const handleImageRemove = (index: number) => {
        const updatedImages = [...images];
        const removedImage = updatedImages.splice(index, 1);

        // Giải phóng bộ nhớ của URL khi xóa ảnh
        if (removedImage[0] && !removedImage[0].startsWith("http")) {
            URL.revokeObjectURL(removedImage[0]);
        }

        setImages(updatedImages);
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-6 max-w-md w-full max-h-[80vh] overflow-y-auto bg-white shadow-lg rounded-lg">
                <DialogTitle className="text-lg font-semibold">
                    Chỉnh sửa bài viết
                </DialogTitle>
                <DialogDescription className="text-gray-500 mb-4">
                    Chỉnh sửa nội dung và hình ảnh của bài viết.
                </DialogDescription>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Nội dung
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none text-sm"
                        placeholder="Nhập nội dung..."
                        rows={4}
                    />
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Hình ảnh
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={
                                        image.startsWith("http") ||
                                        image.startsWith("blob:")
                                            ? image
                                            : `${hostApi}${image}`
                                    }
                                    alt={`Hình ảnh ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg shadow"
                                />
                                <button
                                    onClick={() => handleImageRemove(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {images.length < 10 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Thêm hình ảnh
                            </label>
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                            >
                                <div className="flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <span className="mt-2 text-sm text-gray-500">
                                        Tải ảnh lên (Tối đa 10 ảnh)
                                    </span>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) =>
                                        handleImageChange(e.target.files!)
                                    }
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end space-x-4 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-1/3 border border-gray-300 hover:border-gray-500 hover:text-gray-700"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="w-1/3 bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogViewEditPost;
