import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/axios/axiosConfig";
import { setUserInfo } from "@/redux/userSlice";

const formSchema = z
    .object({
        fullName: z.string().min(1, {
            message: "Tên đầy đủ không được bỏ trống.",
        }),
        password: z.string().min(6, {
            message: "Mật khẩu không được bỏ trống.",
        }),
        newPassword: z.string().min(6, {
            message: "Mật khẩu mới ít nhất 6 ký tự.",
        }),
        newPasswordConfirm: z.string().min(6, {
            message: "Xác nhận mật khẩu mới ít nhất 6 ký tự.",
        }),
    })
    .refine((data) => data.newPassword === data.newPasswordConfirm, {
        message: "Mật khẩu và xác nhận mật khẩu phải khớp.",
        path: ["newPasswordConfirm"],
    });

export default function Setting() {
    const [isChangeName, setIsChangeName] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const dispatch = useDispatch();

    const user = useSelector((state: any) => state?.user?.user);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            password: "",
            newPassword: "",
            newPasswordConfirm: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.fullName || "",
                password: "",
                newPassword: "",
                newPasswordConfirm: "",
            });
        }
    }, [user]);

    const handleChangePassword = () => {
        if (isChangePassword) {
            // Reset password fields when cancelling
            form.reset({
                ...form.getValues(),
                password: "",
                newPassword: "",
                newPasswordConfirm: "",
            });
        }
        setIsChangePassword(!isChangePassword);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted:", values);
    }

    async function fetchUser() {
        try {
            const response = await axiosInstance.get("user/profile");
            dispatch(setUserInfo(response.data));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
        console.log(1);
    }, []);

    return (
        <Card className="grid grid-cols-3">
            <div className="col-span-1">
                <CardHeader>
                    <div className="flex gap-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Thay ảnh</Button>
                    </div>
                    <div className="flex gap-2 items-center">
                        {isChangeName ? (
                            <Input
                                value={form.getValues("fullName")}
                                onChange={(e) =>
                                    form.setValue("fullName", e.target.value)
                                }
                            />
                        ) : (
                            <CardTitle>{form.getValues("fullName")}</CardTitle>
                        )}
                        <Button
                            onClick={() => setIsChangeName(!isChangeName)}
                            variant="outline"
                        >
                            {isChangeName ? "Lưu" : "Đổi tên"}
                        </Button>
                    </div>
                    <CardDescription>Người dùng bình thường</CardDescription>
                </CardHeader>
            </div>
            <div className="col-span-2 p-4">
                <div className="mb-3">
                    <Label>Email</Label>
                    <Input disabled value={user?.email || ""} />
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input
                                                disabled={!isChangePassword}
                                                type="password"
                                                placeholder={
                                                    !isChangePassword
                                                        ? "*****************************"
                                                        : ""
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                handleChangePassword()
                                            }
                                        >
                                            {isChangePassword
                                                ? "Thôi"
                                                : "Đổi mật khẩu"}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isChangePassword && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu mới</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newPasswordConfirm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nhập lại mật khẩu mới
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Đổi</Button>
                            </>
                        )}
                    </form>
                </Form>
            </div>
        </Card>
    );
}
