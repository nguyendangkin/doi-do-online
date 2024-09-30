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
import { toast } from "sonner";

const formSchema = z
    .object({
        fullName: z
            .string()
            .min(2, "Họ tên phải có ít nhất 2 ký tự")
            .optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
        confirmPassword: z.string().optional(),
        avatar: z.any().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword) {
            if (!data.currentPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Vui lòng nhập mật khẩu hiện tại",
                    path: ["currentPassword"],
                });
            }
            if (data.newPassword.length < 6) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 6,
                    type: "string",
                    inclusive: true,
                    message: "Mật khẩu mới phải có ít nhất 6 ký tự",
                    path: ["newPassword"],
                });
            }
            if (data.newPassword !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Mật khẩu không khớp",
                    path: ["confirmPassword"],
                });
            }
        }
    });

export default function Setting() {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state?.user?.user);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isEditName, setIsEditName] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [fullAvatarUrl, setFullAvatarUrl] = useState("");

    const hostApi = import.meta.env.VITE_API_URL;
    const avatarUrl = useSelector((state: any) => state?.user?.user?.avatarUrl);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            avatar: null,
        },
    });

    useEffect(() => {
        if (user?.fullName) {
            form.setValue("fullName", user.fullName);
        }
    }, [user, form]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/user/profile`);
                dispatch(setUserInfo(response.data));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [dispatch]);

    const handleEditName = () => {
        setIsEditName(!isEditName);
    };

    const handleEditPassword = () => {
        setIsEditPassword(!isEditPassword);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setAvatarPreview(reader.result);
                    form.setValue("avatar", file as any);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            let hasChanges = false;

            if (data.fullName && data.fullName !== user.fullName) {
                formData.append("fullName", data.fullName);
                hasChanges = true;
            }

            if (data.newPassword && data.currentPassword) {
                formData.append("currentPassword", data.currentPassword);
                formData.append("newPassword", data.newPassword);
                hasChanges = true;
            }

            if (data.avatar) {
                formData.append("avatar", data.avatar);
                hasChanges = true;
            }

            if (hasChanges) {
                console.log(
                    "Sending updated data:",
                    Object.fromEntries(formData)
                );
                // Gửi request cập nhật
                const response = await axiosInstance.patch(
                    `/user/profile`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                if (response.data) {
                    dispatch(setUserInfo(response.data));
                    // Reset form fields sau khi cập nhật thành công
                    form.reset({
                        fullName: response.data.fullName,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        avatar: null,
                    });
                    setAvatarPreview(null);
                    setIsEditName(false);
                    setIsEditPassword(false);
                    toast.success("Cập nhật thông tin thành công");
                }
            } else {
                console.log("No changes detected");
            }
        } catch (error: any) {
            console.error("Error updating user data:", error);
            toast.error(error);
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
                                `${hostApi}${avatarUrl}` ||
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
                                <FormLabel>Thông Tin Cá Nhân</FormLabel>
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
