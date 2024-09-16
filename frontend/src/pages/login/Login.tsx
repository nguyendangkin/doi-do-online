import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGoogle } from "react-icons/fa";
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
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

const formSchema = z.object({
    email: z.string().min(1, { message: "Email không được để trống." }),
    password: z.string().min(1, { message: "Mật khẩu không được để trống." }),
});

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        try {
            setIsLoading(true);
            const responsive = await axiosInstance.post("/auth/login", values);

            dispatch(setUser(responsive.data));
            toast.success(responsive.data.message);
            navigate("/");
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
                    Đăng nhập
                </CardHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
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
                        <div className="flex justify-between items-center">
                            <div>
                                {isLoading ? (
                                    <Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý...
                                    </Button>
                                ) : (
                                    <Button type="submit">Đăng nhập</Button>
                                )}
                            </div>
                            <FaGoogle
                                className="hover:cursor-pointer hover:opacity-80"
                                size={"30px"}
                            />
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
