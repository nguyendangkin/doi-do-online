import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";

const formSchema = z
    .object({
        username: z.string().min(2, {
            message: "Tên người dùng phải có ít nhất 2 ký tự.",
        }),
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
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
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
                                        <Input {...field} />
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit">Đăng ký</Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
