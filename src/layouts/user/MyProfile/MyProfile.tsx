import { useEffect, useState, useCallback } from "react";
import api from "../../../apis/HttpClient";
import type { UserResponse } from "../../../models/response/user/UserResponse";
import { getMyInfo } from "../../../apis/UserApi";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import UploadHistory from "../components/UploadHistory";

const MyProfile: React.FC = () => {
    const [user, setUser] = useState<UserResponse | null>(null);

    // Input
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [avt, setAvt] = useState<File | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Ẩn/hiện đổi mật khẩu
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Errors
    const [errNewPassword, setErrNewPassword] = useState("");
    const [errConfirmPassword, setErrConfirmPassword] = useState("");

    const [infoMessage, setInfoMessage] = useState("");


    // ================= GET MY INFO =================
    const fetchMyInfo = useCallback(async () => {
        try {
            const response = await getMyInfo();
            setUser(response.result);
            setUsername(response?.result?.username || "");
            setEmail(response?.result?.email || "");
            setBio(response?.result?.bio || "");
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    }, []);

    useEffect(() => {
        fetchMyInfo();
    }, []);
    const handleUpdate = useCallback(async () => {
        let uErr = "";
        let eErr = "";
        let pErr1 = "";
        let pErr2 = "";

        if (username.trim() === "") uErr = "Username không được để trống";
        if (email.trim() === "") eErr = "Email không được để trống";

        // Chỉ validate nếu user bật đổi mật khẩu
        if (showChangePassword && newPassword.trim() !== "") {
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(newPassword)) {
                pErr1 = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt";
            }
            if (confirmPassword.trim() === "") {
                pErr2 = "Vui lòng nhập lại mật khẩu";
            } else if (confirmPassword !== newPassword) {
                pErr2 = "Mật khẩu nhập lại không khớp";
            }
        }

        setErrNewPassword(pErr1);
        setErrConfirmPassword(pErr2);

        if (uErr || eErr || pErr1 || pErr2) return;
        if (!user) return;

        const finalPassword =
            showChangePassword && newPassword.trim() !== ""
                ? newPassword
                : user.password;

        const data = {
            username,
            email,
            bio: bio.trim(),
            roles: user.roles.map((r) => r.name),
            password: finalPassword,
        };

        const formData = new FormData();
        if (avt) formData.append("avt", avt);
        formData.append("data", JSON.stringify(data));

        try {
            await api.put(`/users/my-info`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setInfoMessage("Cập nhật thành công!");
            fetchMyInfo();

            // reset nếu tắt đổi mật khẩu
            setNewPassword("");
            setConfirmPassword("");
            setBio(user?.bio || "");
            setShowChangePassword(false);

        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_UPDATE_FAILED));
        }
    }, [username, email, bio, showChangePassword, newPassword, confirmPassword, user, avt, fetchMyInfo]);

    const handleBioChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value);
    }, []);

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAvt(e.target.files?.[0] || null);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    }, []);

    const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }, []);

    const handleTogglePasswordSection = useCallback(() => {
        if (showChangePassword) {
            setNewPassword("");
            setConfirmPassword("");
            setErrNewPassword("");
            setErrConfirmPassword("");
        }
        setShowChangePassword(!showChangePassword);
    }, [showChangePassword]);


    if (!user) {
        return (
            <div className="container mt-5">
                <h3>Đang tải...</h3>
            </div>
        );
    }

    return (
        <div className="profile-uploads-page">
            <div className="profile-grid">
                <div className="profile-sidebar">
                    <div className="card p-4 shadow-sm">
                        <h3 className="text-center mb-4">Thông tin cá nhân</h3>

                        <div className="text-center mb-4">
                            <img
                                src={`${user.avatarUrl ?? "/images/myAvatar.jpg"}`}
                                alt="avatar"
                                style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "3px solid #ddd", }}
                            />
                        </div>

                        <div style={{ marginBottom: 10 }} className={infoMessage.includes("thành công") ? "success-text" : "error-text"}>
                            {infoMessage}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Username</label>
                            <input type="text" className="form-control" value={username} readOnly />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Email</label>
                            <input type="email" className="form-control" value={email} readOnly />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Bio</label>
                            <textarea
                                className="form-control"
                                value={bio}
                                onChange={handleBioChange}
                                rows={3}
                                placeholder="Nhập tiểu sử ngắn gọn về bạn..."
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Quyền</label>
                            <ul>
                                {user.roles.map((r: { name: string }) => (
                                    <li key={r.name}>{r.name}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Ngày tạo</label>
                            <div>{new Date(user.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Cập nhật lần cuối</label>
                            <div>{new Date(user.updatedAt).toLocaleString()}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Cập nhật Avatar</label>
                            <input type="file" accept="image/*" className="form-control" onChange={handleAvatarChange} />
                        </div>

                        <div className="text-end">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                type="button"
                                onClick={handleTogglePasswordSection}
                            >
                                {showChangePassword ? "Hủy" : "Đổi mật khẩu"}
                            </button>
                        </div>

                        {showChangePassword && (
                            <>
                                <h5 className="fw-bold mt-3">Đổi mật khẩu</h5>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <div style={{ color: "red" }}>{errNewPassword}</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nhập lại mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    <div style={{ color: "red" }}>{errConfirmPassword}</div>
                                </div>
                            </>
                        )}

                        <button className="btn btn-primary w-100 mt-3" onClick={handleUpdate}>
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>

                <div className="uploads-main">
                    <UploadHistory />
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
