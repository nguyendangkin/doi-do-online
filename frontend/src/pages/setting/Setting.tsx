import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/axios/axiosConfig";
import { setUserInfo } from "@/redux/userSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const formSchema = z
    .object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        currentPassword: z
            .string()
            .min(6, "Current password must be at least 6 characters"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export default function Setting() {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state?.user?.user);
    const userEmail = useSelector((state: any) => state?.auth?.user?.email);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isEditName, setIsEditName] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (user?.fullName) {
            form.setValue("fullName", user.fullName);
        }
    }, [user, form]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userEmail) {
                try {
                    const response = await axiosInstance.get(
                        `/user/profile/${userEmail}`
                    );
                    dispatch(setUserInfo(response.data));
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [userEmail, dispatch]);

    const handleEditName = () => {
        setIsEditName(!isEditName);
    };

    const handleEditPassword = () => {
        setIsEditPassword(!isEditPassword);
    };

    const onSubmit = async (data: any) => {
        try {
            // Implement your update logic here
            console.log("Form data:", data);
            // You would typically send this data to your API
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    const handleAvatarChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setAvatarPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage
                            src={
                                avatarPreview ||
                                user?.avatarUrl ||
                                "https://github.com/shadcn.png"
                            }
                        />
                        <AvatarFallback>
                            {user?.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <Input
                        type="file"
                        onChange={handleAvatarChange}
                        accept="image/*"
                    />
                </div>

                <Input
                    disabled
                    value={`Email của bạn - ${user?.email}` || ""}
                />
                <Input
                    disabled
                    value={`Loại người dùng - ${user?.role}` || ""}
                />

                <Card className="p-4 space-y-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={!isEditName} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" onClick={handleEditName}>
                        {isEditName ? "Lưu tên" : "Chỉnh sửa tên"}
                    </Button>

                    {isEditPassword && (
                        <>
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu mới</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nhập lại mật khẩu mới
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <Button
                        type="button"
                        onClick={handleEditPassword}
                        className="ml-2"
                    >
                        {isEditPassword ? "Lưu mật khẩu" : "Chỉnh sửa mật khẩu"}
                    </Button>
                </Card>

                <Button type="submit">Lưu tất cả thay đổi</Button>
            </form>
        </Form>
    );
}
