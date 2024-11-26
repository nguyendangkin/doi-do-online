import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DiaLogUploadContentModal from "@/pages/myStore/DiaLogUploadContentModal";
import axiosInstance from "@/axios/axiosConfig";
import DialogViewEditPost from "@/pages/myStore/DialogViewEditPost";

interface Post {
    id: number;
    content: string;
    images: string[];
    tag: string;
}

export default function MyStore() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const hostApi = import.meta.env.VITE_API_URL;

    // Fetch posts from API
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

    // Open dialog for editing post
    const handleOpenDialogEditPost = (post: Post) => {
        setSelectedPost(post);
        setDialogOpen(true);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <DiaLogUploadContentModal onPostAdded={fetchPosts} />
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer"
                        onClick={() => handleOpenDialogEditPost(post)}
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

            {selectedPost && (
                <DialogViewEditPost
                    post={selectedPost}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSuccess={fetchPosts}
                />
            )}
        </div>
    );
}
