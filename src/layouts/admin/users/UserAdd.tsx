import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../apis/UserApi";
import type { UserRequest } from "../../../models/request/UserRequest";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
const UserAdd: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [roles, setRoles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleRoleChange = (role: string) => {
        setRoles((prev) =>
            prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [...prev, role]
        );

    };

    const handleCreateUser = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            const newUser: UserRequest = {
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                bio: "",
                verified: true,
                roles: roles,
                hide: false
            };

            await createUser(newUser);
            navigate("/users");

        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CREATE_FAILED);
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-user-page">
            <div className="user-container narrow">
                <div className="user-form-card">
                    <div className="user-form-header">
                        <div>
                            <p className="user-eyebrow">Quản lý người dùng</p>
                            <h1>Thêm người dùng mới</h1>
                            <p>Tạo tài khoản mới cho giảng viên hoặc quản trị viên. </p>
                        </div>
                        <button
                            type="button"
                            className="user-btn ghost"
                            onClick={() => navigate("/users")}
                        >
                            Quay lại
                        </button>
                    </div>

                    {error && (<div className="user-alert error"><p>{error}</p></div>)}

                    <div className="user-form">
                        <label className="form-field">
                            <span>Tên đăng nhập</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)}
                                className="user-input"
                                placeholder="Ví dụ: john_doe"
                            />
                        </label>
                        <label className="form-field">
                            <span>Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="user-input"
                                placeholder="Ví dụ: john@example.com"
                            />
                        </label>

                        <label className="form-field">
                            <span>Mật khẩu </span>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)}
                                className="user-input"
                                placeholder="Nhập mật khẩu ít nhất 6 ký tự"
                            />
                        </label>

                        <div className="form-field">
                            <span>Vai trò</span>

                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={roles.includes("ADMIN")}
                                        onChange={() =>
                                            handleRoleChange("ADMIN")
                                        }
                                    />
                                    <span>ADMIN</span>

                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={roles.includes("USER")}
                                        onChange={() => handleRoleChange("USER")}
                                    />
                                    <span>USER</span>
                                </label>
                            </div>
                        </div>

                        <div className="user-form-actions">
                            <button
                                type="button"
                                className="user-btn primary"
                                disabled={isSubmitting}
                                onClick={handleCreateUser}
                            >
                                {isSubmitting ? "Đang lưu..." : "Thêm người dùng"}
                            </button>
                            <button
                                type="button"
                                className="user-btn subtle"
                                onClick={() => {
                                    setUsername("");
                                    setEmail("");
                                    setPassword("");
                                    setRoles([]);
                                    setError(null);

                                }}
                            >
                                Xóa nội dung
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UserAdd;