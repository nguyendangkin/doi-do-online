import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance from "@/axios/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postsSlice";
import { useSearchParams } from "react-router-dom";
import ProductDetailModal from "@/pages/home/ProductDetailModal";
import MessengerChat from "@/pages/chats/Chat";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Post {
    id: number;
    content: string;
    images: string[];
    user: {
        id: number;
        email: string;
    };
    tag: string;
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
    const posts = useSelector((state: any) => state?.post?.posts) as Post[];
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: any) => state?.auth?.user);
    const userId = useSelector((state: any) => state?.user?.user);

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<{
        id: number;
        email: string;
    } | null>(null);

    const [tags, setTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const hostApi = import.meta.env.VITE_API_URL;
    const POSTS_PER_PAGE = 8;

    const shouldShowChatButton = (postUserId: number) => {
        return userId?.id !== undefined && userId.id !== postUserId;
    };

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    const handleChatWithSeller = async (
        seller: { id: number; email: string },
        postId: number
    ) => {
        if (shouldShowChatButton(seller.id)) {
            try {
                await axiosInstance.get(
                    `/chats/seller/${seller.id}/post/${postId}`
                );

                setSelectedSeller(seller);
                setIsChatOpen(true);
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        }
    };

    const fetchPosts = async (page: number = 1, tag: string | null = null) => {
        try {
            let url = `/posts/all?page=${page}&limit=${POSTS_PER_PAGE}`;
            if (tag) {
                url += `&tag=${encodeURIComponent(tag)}`;
            }
            const searchTerm = searchParams.get("q");
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            const response = await axiosInstance.get<PaginatedResponse>(url);
            dispatch(setPosts(response.data.items));
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

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

    useEffect(() => {
        fetchPosts(currentPage, selectedTag);
    }, [currentPage, selectedTag, searchParams]);

    const handleTagClick = (tag: string) => {
        if (selectedTag === tag) {
            setSelectedTag(null);
            setCurrentPage(1);
        } else {
            setSelectedTag(tag);
            setCurrentPage(1);
        }
    };

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
            <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/90"
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts &&
                    posts.map((post) => (
                        <Card
                            key={post.id}
                            className="hover:shadow-lg transition-shadow duration-300"
                        >
                            <CardHeader
                                className="cursor-pointer"
                                onClick={() => handlePostClick(post)}
                            >
                                <img
                                    className="w-full h-[200px] object-cover aspect-w-16 aspect-h-9 rounded"
                                    src={hostApi + post.images[0]}
                                    alt={`Post ${post.id}`}
                                />
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3">{post.content}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    <div className="flex justify-between items-center">
                                        <p>Đăng bởi: {post.user.email}</p>
                                        {shouldShowChatButton(post.user.id) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleChatWithSeller(
                                                        post.user,
                                                        post.id
                                                    )
                                                }
                                                className="ml-2"
                                            >
                                                <MessageCircle className="h-4 w-4 mr-1" />
                                                Chat
                                            </Button>
                                        )}
                                    </div>
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
                                    <Badge variant="outline" className="mt-2">
                                        {post.tag}
                                    </Badge>
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

            {/* Product Detail Modal */}
            {selectedPost && (
                <ProductDetailModal
                    post={selectedPost}
                    isOpen={!!selectedPost}
                    onClose={handleCloseModal}
                />
            )}

            {/* Chat Dialog */}
            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            Chat với {selectedSeller?.email}
                        </DialogTitle>
                    </DialogHeader>
                    {/* Thêm DialogDescription hoặc aria-describedby */}
                    <DialogDescription className="sr-only">
                        Chat với người bán {selectedSeller?.email}
                    </DialogDescription>
                    {selectedSeller && (
                        <MessengerChat
                            currentUser={userId}
                            sellerId={selectedSeller.id}
                            postId={selectedPost?.id}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
