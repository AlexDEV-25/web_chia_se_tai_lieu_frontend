import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../apis/UserApi";
import type { UserRequest } from "../../../models/request/UserRequest";
import axios from "axios";

const UserAdd: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [roles, setRoles] = useState<string[]>([]);

    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [rolesError, setRolesError] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        let isValid = true;
        let localUsernameError = "";
        let localEmailError = "";
        let localPasswordError = "";
        let localRolesError = "";

        if (username.trim() === "") {
            localUsernameError = "Vui lòng nhập tên đăng nhập.";
            isValid = false;
        }

        if (email.trim() === "") {
            localEmailError = "Vui lòng nhập email.";
            isValid = false;
        } else if (!validateEmail(email)) {
            localEmailError = "Email không hợp lệ.";
            isValid = false;
        }

        if (password.trim() === "") {
            localPasswordError = "Vui lòng nhập mật khẩu.";
            isValid = false;
        } else if (password.length < 6) {
            localPasswordError = "Mật khẩu phải có ít nhất 6 ký tự.";
            isValid = false;
        }

        if (roles.length === 0) {
            localRolesError = "Vui lòng chọn ít nhất một vai trò.";
            isValid = false;
        }

        setUsernameError(localUsernameError);
        setEmailError(localEmailError);
        setPasswordError(localPasswordError);
        setRolesError(localRolesError);

        return isValid;
    };

    const handleRoleChange = (role: string) => {
        setRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        setFormError(null);
        setIsSubmitting(true);

        try {
            const newUser: UserRequest = {
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                verified: true,
                roles: roles,
                hide: false
            };
            await createUser(newUser);
            navigate("/users");
        } catch (err: any) {
            let message = "Không thể tạo người dùng mới. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            setFormError(message);
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
                            <p>Tạo tài khoản mới cho giảng viên hoặc quản trị viên.</p>
                        </div>
                        <button
                            type="button"
                            className="user-btn ghost"
                            onClick={() => navigate("/users")}
                        >
                            Quay lại
                        </button>
                    </div>

                    {formError && (
                        <div className="user-alert error">
                            <p>{formError}</p>
                        </div>
                    )}

                    <form className="user-form" onSubmit={handleSubmit} noValidate>
                        <label className="form-field">
                            <span>Tên đăng nhập</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`user-input ${usernameError ? "has-error" : ""}`}
                                placeholder="Ví dụ: john_doe"
                            />
                            {usernameError && <small className="field-error">{usernameError}</small>}
                        </label>

                        <label className="form-field">
                            <span>Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`user-input ${emailError ? "has-error" : ""}`}
                                placeholder="Ví dụ: john@example.com"
                            />
                            {emailError && <small className="field-error">{emailError}</small>}
                        </label>

                        <label className="form-field">
                            <span>Mật khẩu</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`user-input ${passwordError ? "has-error" : ""}`}
                                placeholder="Nhập mật khẩu ít nhất 6 ký tự"
                            />
                            {passwordError && <small className="field-error">{passwordError}</small>}
                        </label>

                        <fieldset className="form-field">
                            <legend>Vai trò</legend>
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={roles.includes("ADMIN")}
                                        onChange={() => handleRoleChange("ADMIN")}
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
                            {rolesError && <small className="field-error">{rolesError}</small>}
                        </fieldset>

                        <div className="user-form-actions">
                            <button
                                type="submit"
                                className="user-btn primary"
                                disabled={isSubmitting}
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
                                    setUsernameError("");
                                    setEmailError("");
                                    setPasswordError("");
                                    setRolesError("");
                                    setFormError(null);
                                }}
                            >
                                Xóa nội dung
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserAdd;