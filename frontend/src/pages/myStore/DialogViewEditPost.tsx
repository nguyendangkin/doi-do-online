import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/axios/axiosConfig";

interface Post {
    id: number;
    content: string;
    images: string[];
    tag: string;
}

interface DialogViewEditPostProps {
    post: Post;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type ImageItem = string | File;

const DialogViewEditPost: React.FC<DialogViewEditPostProps> = ({
    post,
    open,
    onClose,
    onSuccess,
}) => {
    const [content, setContent] = useState(post.content);
    const [images, setImages] = useState<ImageItem[]>(post.images);
    const [error, setError] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>(post.tag);
    const [isLoading, setIsLoading] = useState(false);

    const hostApi = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setContent(post.content);
        setImages(post.images);
        setSelectedTag(post.tag);
    }, [post]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get("/posts/tags");
                setTags(response.data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };
        fetchTags();
    }, []);

    const handleImageChange = (newImages: FileList) => {
        if (newImages) {
            const fileArray = Array.from(newImages);

            if (images.length + fileArray.length > 10) {
                setError("Chỉ được tải lên tối đa 10 ảnh.");
                return;
            }

            setImages((prev) => [...prev, ...(fileArray as File[])]);
            setError("");
        }
    };

    const handleSave = async () => {
        try {
            if (!content.trim() || images.length === 0 || !selectedTag) {
                setError(
                    "Vui lòng nhập nội dung, ít nhất một hình ảnh và chọn tag."
                );
                return;
            }

            setIsLoading(true);

            // Create FormData for the API request
            const formData = new FormData();

            // Add existing images that are Files
            images.forEach((image) => {
                if (image instanceof File) {
                    formData.append("images", image);
                }
            });

            // Add the content and tag
            formData.append("content", content);
            formData.append("tag", selectedTag);

            // Send the update request
            await axiosInstance.put(`/posts/${post.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Call onSuccess to refresh the posts list
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving post:", error);
            setError("Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageRemove = (index: number) => {
        setImages((prev) => {
            const updatedImages = [...prev];
            const removedImage = updatedImages[index];

            // Revoke object URL if it's a File
            if (removedImage instanceof File) {
                URL.revokeObjectURL(URL.createObjectURL(removedImage));
            }

            updatedImages.splice(index, 1);
            return updatedImages;
        });
    };

    const handleTagChange = (value: string) => {
        setSelectedTag(value);
    };

    const getImageUrl = (image: ImageItem): string => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return image.startsWith("http") ? image : `${hostApi}${image}`;
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
                                    src={getImageUrl(image)}
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

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Chọn tag
                    </label>
                    <Select onValueChange={handleTagChange} value={selectedTag}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn một tag" />
                        </SelectTrigger>
                        <SelectContent>
                            {tags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end space-x-4 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-1/3 border border-gray-300 hover:border-gray-500 hover:text-gray-700"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-1/3 bg-blue-500 text-white hover:bg-blue-600"
                    >
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogViewEditPost;
