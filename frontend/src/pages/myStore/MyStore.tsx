import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DiaLogUploadContentModal from "@/pages/myStore/DiaLogUploadContentModal";
import axiosInstance from "@/axios/axiosConfig";
import DialogViewEditPost from "@/pages/myStore/DialogViewEditPost";

interface Posts {
    id: number;
    content: string;
    images: string[];
}

export default function MyStore() {
    const [posts, setPosts] = useState<Posts[]>([]); // State for posts
    const [selectedPost, setSelectedPost] = useState<Posts | null>(null); // State for selected post
    const [dialogOpen, setDialogOpen] = useState<boolean>(false); // State to control dialog visibility
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

    // Handle opening the dialog with the selected post
    const handleOpenDialogEditPost = (post: Posts) => {
        setSelectedPost(post); // Set the selected post
        setDialogOpen(true); // Open the dialog
    };

    // Handle saving the updated post data
    const handleSavePost = async (updatedPost: Posts) => {
        try {
            await axiosInstance.put(`/posts/${updatedPost.id}`, updatedPost);
            setDialogOpen(false); // Close the dialog after saving
            fetchPosts(); // Refresh the post list
        } catch (error) {
            console.error("Error saving the post:", error);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <DiaLogUploadContentModal onPostAdded={fetchPosts} />
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer"
                        onClick={() => handleOpenDialogEditPost(post)} // Pass the post to the dialog
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
                    onClose={() => setDialogOpen(false)} // Close the dialog
                    onSave={handleSavePost} // Save the changes
                />
            )}
        </div>
    );
}
