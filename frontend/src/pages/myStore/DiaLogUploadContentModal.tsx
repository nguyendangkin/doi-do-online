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
import { X } from "lucide-react";

const DiaLogUploadContentModal = () => {
    const [images, setImages] = useState<File[]>([]);

    useEffect(() => {
        return () => {
            images.forEach((image) =>
                URL.revokeObjectURL(URL.createObjectURL(image))
            );
        };
    }, [images]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            if (images.length + fileArray.length > 10) {
                alert("Bạn chỉ được chọn tối đa 10 ảnh.");
                return;
            }
            setImages((prevImages) => [...prevImages, ...fileArray]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            URL.revokeObjectURL(URL.createObjectURL(prevImages[index]));
            return updatedImages;
        });
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer flex justify-center items-center">
            <Dialog>
                <DialogTrigger asChild>
                    <div className="w-full h-full flex justify-center items-center">
                        <CgAdd className="text-4xl" />
                    </div>
                </DialogTrigger>
                <DialogContent className="p-6">
                    <DialogTitle>Nhập thông tin</DialogTitle>
                    <DialogDescription>
                        Bạn có thể thêm tối đa 10 ảnh và nhập nội dung tối đa 50
                        từ.
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
                        <>
                            <label className="block mb-2 text-sm font-medium">
                                Nhập ảnh (Tối đa 10 ảnh):
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="mb-4 w-full p-2 border border-gray-300 rounded text-sm"
                                onChange={handleImageChange}
                            />
                        </>
                    )}

                    <label className="block mb-2 text-sm font-medium">
                        Nhập nội dung (Tối đa 50 từ):
                    </label>
                    <textarea
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="Nhập nội dung..."
                        maxLength={250}
                    ></textarea>

                    <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 text-sm">
                        Gửi
                    </button>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default DiaLogUploadContentModal;
