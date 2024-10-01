import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DiaLogUploadContentModal from "@/pages/myStore/DiaLogUploadContentModal";
import axiosInstance from "@/axios/axiosConfig";

interface Posts {
    id: number;
    content: string;
    images: string[];
}

export default function MyStore() {
    const [posts, setPosts] = useState<Posts[]>([]); // Sửa ở đây
    const hostApi = import.meta.env.VITE_API_URL;

    const fetchPosts = async () => {
        try {
            const response = await axiosInstance.get("/posts");
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Hàm gọi lại sau khi bài viết mới được thêm
    const handlePostAdded = () => {
        fetchPosts(); // Gọi lại để lấy danh sách mới
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <DiaLogUploadContentModal onPostAdded={handlePostAdded} />
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer"
                    >
                        <CardHeader>
                            <img
                                className="w-full h-[200px] object-cover aspect-w-16 aspect-h-9 rounded"
                                src={hostApi + post.images[0]}
                                alt={`Post ${post.id} thumbnail`}
                            />
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3">{post.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
