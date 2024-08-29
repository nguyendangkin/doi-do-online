import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import axiosInstance from "@/axios/axiosConfig";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z
    .object({
        fullName: z
            .string()
            .min(2, { message: "Tên đầy đủ phải có ít nhất 2 ký tự." }),
        email: z.string().email({ message: "Địa chỉ email không hợp lệ." }),
        password: z
            .string()
            .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
        confirmPassword: z
            .string()
            .min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu và xác nhận mật khẩu phải khớp.",
        path: ["confirmPassword"], // Chỉ định trường gặp lỗi
    });

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        try {
            setIsLoading(true);
            const responsive = await axiosInstance.post(
                "/auth/register",
                values
            );
            toast.success(responsive.data.message);
            navigate("/dang-nhap");
        } catch (error: any) {
            toast.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-[500px] p-4 mx-auto shadow-lg rounded-lg bg-white">
                <CardHeader className="text-center text-xl font-semibold mb-4">
                    Đăng ký tài khoản
                </CardHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem className="!mt-2">
                                    <FormLabel>Tên đầy đủ</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="!mt-2">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="!mt-2">
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="!mt-2">
                                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            {isLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </Button>
                            ) : (
                                <Button type="submit">Đăng ký</Button>
                            )}
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
