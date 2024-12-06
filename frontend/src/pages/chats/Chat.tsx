import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Send, Search, Image as ImageIcon, X } from "lucide-react";
import axiosInstance from "@/axios/axiosConfig";

interface Conversation {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
}

interface Message {
    id: number;
    content: string | string[];
    senderId?: number; // Optional vì API response không có
    timestamp: string;
    type: "text" | "image" | "multiple-images";
}
interface MessengerChatProps {
    sellerId?: number;
    postId?: number; // Thêm prop này
    currentUser: { id: number; email: string };
}

const MessengerChat: React.FC<MessengerChatProps> = ({
    sellerId,
    currentUser,
    postId,
}) => {
    // States
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations
    const formatChatData = (chat: any) => {
        const otherUser =
            currentUser.id === chat.sender.id ? chat.receiver : chat.sender;
        return {
            id: chat.id,
            name: otherUser.fullName || otherUser.email,
            avatar: otherUser.avatarUrl,
            lastMessage: chat.lastMessage,
            timestamp: new Date(chat.timestamp).toLocaleString(),
            unread: chat.unread,
        };
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                if (sellerId && postId) {
                    // Check cả postId
                    const response = await axiosInstance.get(
                        `/chats/seller/${sellerId}/post/${postId}`
                    );
                    const formattedChat = formatChatData(response.data);
                    setConversations([formattedChat]);
                    setSelectedChat(formattedChat);
                } else {
                    const response = await axiosInstance.get("/chats");
                    const formattedChats = response.data.map(formatChatData);
                    setConversations(formattedChats);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        fetchConversations();
    }, [sellerId, postId, currentUser]); // Thêm postId vào dependencies

    // Fetch messages when selecting a chat
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await axiosInstance.get(
                        `/chats/${selectedChat.id}`
                    );

                    // Map messages với senderId từ message.sender.id thay vì chat.sender.id
                    const messagesWithSender = response.data.messages.map(
                        (msg: any) => ({
                            id: msg.id,
                            content: msg.content,
                            senderId: msg.sender.id, // Lấy ID từ sender của mỗi tin nhắn
                            timestamp: msg.timestamp,
                            type: msg.type,
                        })
                    );

                    setMessages(messagesWithSender);
                    scrollToBottom();
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };
        fetchMessages();
    }, [selectedChat]);

    // Handlers
    const handleSelectChat = (conversation: Conversation) => {
        setSelectedChat(conversation);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if ((newMessage.trim() || previewImages.length > 0) && selectedChat) {
            try {
                const newMessages: Message[] = [];

                if (previewImages.length > 0) {
                    const formData = new FormData();
                    previewImages.forEach((image) => {
                        formData.append("images", image);
                    });

                    const imageMessage = {
                        chatId: selectedChat.id,
                        senderId: currentUser.id, // Use actual user ID
                        content: previewImages,
                        type:
                            previewImages.length === 1
                                ? "image"
                                : "multiple-images",
                    };

                    await axiosInstance.post(
                        `/messages/${selectedChat.id}`,
                        imageMessage
                    );

                    newMessages.push({
                        id: Date.now(),
                        content: previewImages,
                        senderId: currentUser.id, // Use actual user ID
                        timestamp: new Date().toLocaleTimeString(),
                        type:
                            previewImages.length === 1
                                ? "image"
                                : "multiple-images",
                    });

                    setPreviewImages([]);
                }

                if (newMessage.trim()) {
                    const textMessage = {
                        chatId: selectedChat.id,
                        senderId: currentUser.id, // Send actual user ID
                        content: newMessage,
                        type: "text",
                    };

                    await axiosInstance.post(
                        `/messages/${selectedChat.id}`,
                        textMessage
                    );

                    newMessages.push({
                        id: Date.now() + 1,
                        content: newMessage,
                        senderId: currentUser.id, // Use actual user ID
                        timestamp: new Date().toLocaleTimeString(),
                        type: "text",
                    });

                    setNewMessage("");
                }

                setMessages([...messages, ...newMessages]);
                setTimeout(scrollToBottom, 100);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    // Rest of the component remains the same...
    const handleImageClick = (imageSrc: string) => {
        setModalImage(imageSrc);
        setIsImageModalOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newImages]);
    };

    const removePreviewImage = (index: number) => {
        setPreviewImages(previewImages.filter((_, i) => i !== index));
    };

    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Message renderer
    const renderMessage = (message: Message) => {
        switch (message.type) {
            case "image":
                return (
                    <img
                        src={message.content as string}
                        alt="Sent image"
                        className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                            handleImageClick(message.content as string)
                        }
                    />
                );
            case "multiple-images":
                return (
                    <div className="grid grid-cols-2 gap-1">
                        {(message.content as string[]).map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Sent image ${index + 1}`}
                                className="max-w-[150px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => handleImageClick(img)}
                            />
                        ))}
                    </div>
                );
            default:
                return <p>{message.content as string}</p>;
        }
    };

    // Update message rendering to compare actual user IDs
    const renderMessages = () => {
        if (!selectedChat) return null;

        return messages.map((message) => {
            // Kiểm tra xem tin nhắn có phải của current user không
            const isCurrentUserMessage = message.senderId === currentUser.id;

            return (
                <div
                    key={message.id}
                    className={`flex ${
                        isCurrentUserMessage ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        className={`flex gap-2 max-w-[70%] ${
                            isCurrentUserMessage
                                ? "flex-row-reverse"
                                : "flex-row"
                        }`}
                    >
                        {!isCurrentUserMessage && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={selectedChat.avatar}
                                    alt={selectedChat.name}
                                />
                                <AvatarFallback>
                                    {selectedChat.name[0]}
                                </AvatarFallback>
                            </Avatar>
                        )}

                        <div
                            className={`rounded-lg p-3 ${
                                isCurrentUserMessage && message.type === "text"
                                    ? "bg-blue-500 text-white"
                                    : message.type === "text"
                                    ? "bg-gray-100"
                                    : ""
                            }`}
                        >
                            {renderMessage(message)}
                            <span className="text-xs opacity-70 mt-1 block">
                                {message.timestamp}
                            </span>
                        </div>
                    </div>
                </div>
            );
        });
    };
    // Return JSX (same as before)
    return (
        <Card className="h-[600px] flex rounded-lg overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                                selectedChat?.id === conv.id
                                    ? "bg-gray-100"
                                    : ""
                            }`}
                            onClick={() => handleSelectChat(conv)}
                        >
                            <Avatar>
                                <AvatarImage
                                    src={conv.avatar}
                                    alt={conv.name}
                                />
                                <AvatarFallback>{conv.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">{conv.name}</p>
                                    <span className="text-xs text-gray-500">
                                        {conv.timestamp}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 truncate">
                                        {conv.lastMessage}
                                    </p>
                                    {conv.unread > 0 && (
                                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            {selectedChat ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={selectedChat.avatar}
                                alt={selectedChat.name}
                            />
                            <AvatarFallback>
                                {selectedChat.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-medium">{selectedChat.name}</h2>
                            <p className="text-sm text-gray-500">
                                Đang hoạt động
                            </p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {renderMessages()}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                    {/* Image Preview Area */}
                    {previewImages.length > 0 && (
                        <div className="p-2 border-t">
                            <div className="flex gap-2 overflow-x-auto">
                                {previewImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt={`Preview ${index + 1}`}
                                            className="h-20 w-20 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() =>
                                                removePreviewImage(index)
                                            }
                                            className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors"
                                        >
                                            <X className="h-3 w-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nhập tin nhắn..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") handleSendMessage();
                                }}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="hover:bg-gray-100 transition-colors"
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={handleSendMessage}
                                className="hover:bg-blue-600 transition-colors"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    Chọn một cuộc trò chuyện để bắt đầu
                </div>
            )}

            {/* Image Preview Modal */}
            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogContent
                    className="max-w-4xl p-0 overflow-hidden"
                    aria-describedby="image-preview-description"
                >
                    <div id="image-preview-description" className="sr-only">
                        Xem trước hình ảnh trong cuộc trò chuyện
                    </div>
                    {modalImage && (
                        <img
                            src={modalImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default MessengerChat;