import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DiaLogUploadContentModal from "@/pages/myStore/DiaLogUploadContentModal";
import axiosInstance from "@/axios/axiosConfig";
import DialogViewEditPost from "@/pages/myStore/DialogViewEditPost";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Post {
    id: number;
    content: string;
    images: string[];
    tag: string;
}

interface PaginatedResponse {
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function MyStore() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const hostApi = import.meta.env.VITE_API_URL;
    const POSTS_PER_PAGE = 5;

    // Fetch posts from API with pagination
    const fetchPosts = async (page: number = 1) => {
        try {
            const response = await axiosInstance.get<PaginatedResponse>(
                `/posts?page=${page}&limit=${POSTS_PER_PAGE}`
            );
            setPosts(response.data.items);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    // Open dialog for editing post
    const handleOpenDialogEditPost = (post: Post) => {
        setSelectedPost(post);
        setDialogOpen(true);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <DiaLogUploadContentModal
                    onPostAdded={() => fetchPosts(currentPage)}
                />
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
                    onSuccess={() => fetchPosts(currentPage)}
                />
            )}

            <Pagination className="justify-center">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() =>
                                currentPage > 1 &&
                                handlePageChange(currentPage - 1)
                            }
                            className={
                                currentPage <= 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {getPageNumbers().map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={() => handlePageChange(page)}
                                className={
                                    currentPage === page
                                        ? "bg-primary text-primary-foreground"
                                        : "cursor-pointer"
                                }
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                currentPage < totalPages &&
                                handlePageChange(currentPage + 1)
                            }
                            className={
                                currentPage >= totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
