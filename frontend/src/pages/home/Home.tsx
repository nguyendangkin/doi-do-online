import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance from "@/axios/axiosConfig";

interface Post {
    id: number;
    content: string;
    images: string[];
    user: {
        email: string;
    };
    createdAt: string;
}

interface PaginatedResponse {
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const hostApi = import.meta.env.VITE_API_URL;
    const POSTS_PER_PAGE = 8; // Showing 8 posts per page since we have a 4-column grid

    const fetchPosts = async (page: number = 1) => {
        try {
            const response = await axiosInstance.get<PaginatedResponse>(
                `/posts/all?page=${page}&limit=${POSTS_PER_PAGE}`
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer"
                    >
                        <CardHeader>
                            <img
                                className="w-full h-[200px] object-cover aspect-w-16 aspect-h-9 rounded"
                                src={hostApi + post.images[0]}
                                alt={`Post ${post.id}`}
                            />
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3">{post.content}</p>
                            <div className="mt-2 text-sm text-gray-500">
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
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Pagination className="my-5 justify-center">
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
        </>
    );
}
