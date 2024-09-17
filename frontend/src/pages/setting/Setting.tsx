import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/axios/axiosConfig";
import { setUserInfo } from "@/redux/userSlice";

export default function Setting() {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state?.user?.user);

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState(
        user?.avatar || "https://github.com/shadcn.png"
    );
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(
        null
    );
    const [isEditing, setIsEditing] = useState({
        fullName: false,
        password: false,
    });
    const [errors, setErrors] = useState({
        fullName: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        avatar: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const response = await axiosInstance.get("user/profile");
            dispatch(setUserInfo(response.data));
            setFullName(response.data.fullName);
            setEmail(response.data.email);
            setAvatar(response.data.avatar || "https://github.com/shadcn.png");
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditToggle = (field: keyof typeof isEditing) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
        if (field === "password") {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (fullName.trim().length < 2) {
            newErrors.fullName = "Tên đầy đủ phải dài ít nhất 2 ký tự";
            isValid = false;
        } else {
            newErrors.fullName = "";
        }

        if (isEditing.password) {
            if (currentPassword.trim() === "") {
                newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc";
                isValid = false;
            } else {
                newErrors.currentPassword = "";
            }

            if (newPassword.trim().length < 6) {
                newErrors.newPassword = "Mật khẩu mới phải dài ít nhất 6 ký tự";
                isValid = false;
            } else {
                newErrors.newPassword = "";
            }

            if (newPassword !== confirmPassword) {
                newErrors.confirmPassword = "Mật khẩu không khớp";
                isValid = false;
            } else {
                newErrors.confirmPassword = "";
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const updatedInfo: any = { fullName };
            if (isEditing.password) {
                updatedInfo.currentPassword = currentPassword;
                updatedInfo.newPassword = newPassword;
            }

            // Tải lên ảnh đại diện mới nếu có
            if (newAvatarFile) {
                const formData = new FormData();
                formData.append("avatar", newAvatarFile);
                const avatarResponse = await axiosInstance.post(
                    "user/avatar",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                updatedInfo.avatar = avatarResponse.data.avatarUrl;
            }

            setIsEditing({
                fullName: false,
                password: false,
            });
            await axiosInstance.put("user/profile", updatedInfo);
            fetchUser();
            setNewAvatarFile(null);
            setNewAvatarPreview(null);
            alert("Thông tin đã được cập nhật thành công");
        } catch (error) {
            console.log(error);
            alert("Không thể cập nhật thông tin");
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    avatar: "Kích thước file không được vượt quá 5MB",
                }));
                return;
            }

            setNewAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setErrors((prev) => ({ ...prev, avatar: "" }));
        }
    };

    return (
        <Card className="grid grid-cols-3">
            <div className="col-span-1">
                <CardHeader>
                    <div className="flex flex-col items-center gap-2">
                        <Avatar
                            className="w-24 h-24 cursor-pointer"
                            onClick={handleAvatarClick}
                        >
                            <AvatarImage src={newAvatarPreview || avatar} />
                            <AvatarFallback>
                                {fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button variant="outline" onClick={handleAvatarClick}>
                            Chọn ảnh mới
                        </Button>
                        {newAvatarPreview && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setNewAvatarFile(null);
                                    setNewAvatarPreview(null);
                                }}
                            >
                                Hủy
                            </Button>
                        )}
                        {errors.avatar && (
                            <p className="text-red-500 text-sm">
                                {errors.avatar}
                            </p>
                        )}
                    </div>
                </CardHeader>
            </div>
            <div className="col-span-2 p-4">
                {/* Email */}
                <div className="mb-3 flex items-center justify-between">
                    <Label>Email</Label>
                    <Input className="ml-3" disabled value={email} />
                </div>

                {/* Full Name */}
                <div className="mb-3 flex items-center justify-between">
                    <Label>Tên đầy đủ</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            disabled={!isEditing.fullName}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <Button
                            variant="outline"
                            onClick={() => handleEditToggle("fullName")}
                        >
                            {isEditing.fullName ? "Thôi" : "Chỉnh sửa"}
                        </Button>
                    </div>
                </div>
                {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}

                {/* Password */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <Label>Mật khẩu</Label>
                        <Button
                            variant="outline"
                            onClick={() => handleEditToggle("password")}
                        >
                            {isEditing.password ? "Thôi" : "Chỉnh sửa"}
                        </Button>
                    </div>
                    {isEditing.password && (
                        <>
                            <div className="mb-2">
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    placeholder="Mật khẩu hiện tại"
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                />
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm">
                                        {errors.currentPassword}
                                    </p>
                                )}
                            </div>
                            <div className="mb-2">
                                <Input
                                    type="password"
                                    value={newPassword}
                                    placeholder="Mật khẩu mới"
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm">
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    placeholder="Nhập lại mật khẩu mới"
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSave}>Lưu tất cả</Button>
                </div>
            </div>
        </Card>
    );
}
