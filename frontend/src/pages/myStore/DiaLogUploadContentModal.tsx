import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { CgAdd } from "react-icons/cg";
import { Card } from "@/components/ui/card";
import { X, Upload } from "lucide-react";
import axiosInstance from "@/axios/axiosConfig";
import { Button } from "@/components/ui/button";

interface DiaLogUploadContentModalProps {
    onPostAdded: () => void; // Chỉ định kiểu cho onPostAdded
}

const DiaLogUploadContentModal: React.FC<DiaLogUploadContentModalProps> = ({
    onPostAdded,
}) => {
    const [images, setImages] = useState<File[]>([]);
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false); // State để điều khiển modal

    useEffect(() => {
        return () => {
            images.forEach((image) =>
                URL.revokeObjectURL(URL.createObjectURL(image))
            );
        };
    }, [images]);

    /// http://localhost:3000/posts/tags

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            if (images.length + fileArray.length > 10) {
                setError("Bạn chỉ được chọn tối đa 10 ảnh.");
                return;
            }
            setImages((prevImages) => [...prevImages, ...fileArray]);
            setError("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            URL.revokeObjectURL(URL.createObjectURL(prevImages[index]));
            return updatedImages;
        });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSubmit = async () => {
        if (images.length === 0 || content.trim() === "") {
            setError("Vui lòng chọn ít nhất 1 ảnh và nhập nội dung.");
            return;
        }

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("images", image);
        });
        formData.append("content", content);

        try {
            await axiosInstance.post("/posts", formData);
            // Gọi callback sau khi bài viết đã được thêm
            onPostAdded();
            // Reset form after successful submission
            setImages([]);
            setContent("");
            setError("");
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            setError("Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại.");
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer flex justify-center items-center">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <div className="w-full h-full flex justify-center items-center">
                        <CgAdd className="text-4xl" />
                    </div>
                </DialogTrigger>
                <DialogContent className="p-6">
                    <DialogTitle>Nhập thông tin</DialogTitle>
                    <DialogDescription>
                        Bạn cần chọn ít nhất 1 ảnh và nhập nội dung (tối đa 50
                        từ).
                    </DialogDescription>

                    <div className="mb-4">
                        {images.length > 0 && (
                            <div className="grid grid-cols-5 gap-2">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index}`}
                                            className="w-full h-16 object-cover rounded"
                                        />
                                        <button
                                            onClick={() =>
                                                handleRemoveImage(index)
                                            }
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {images.length < 10 && (
                        <div className="mb-4">
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                            >
                                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-200">
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-500">
                                            Tải ảnh lên (Tối đa 10 ảnh)
                                        </span>
                                    </div>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    )}

                    <label className="block mb-2 text-sm font-medium">
                        Nhập nội dung (Tối đa 50 từ):
                    </label>
                    <textarea
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="Nhập nội dung..."
                        maxLength={250}
                        value={content}
                        onChange={handleContentChange}
                    ></textarea>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <Button onClick={handleSubmit} className="mt-4 w-full">
                        Gửi
                    </Button>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default DiaLogUploadContentModal;
