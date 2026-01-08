import { useState, useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { changePassword } from "../../../apis/AuthApi";
import type { ChangePasswordRequest } from "../../../models/request/ChangePasswordRequest";

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const { email } = useParams();
    const { forgotPasswordCode } = useParams();
    console.log("email", email);
    console.log("forgotPasswordCode", forgotPasswordCode);
    const hasValidLink = email !== "" && forgotPasswordCode !== "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [changeMessage, setChangeMessage] = useState("");
    const [changeSuccess, setChangeSuccess] = useState(false);

    const [changing, setChanging] = useState(false);

    const handleChangePassword = async () => {
        if (!hasValidLink) {
            setChangeSuccess(false);
            setChangeMessage("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
            return;
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        let passwordErr = "";
        if (password.trim() === "") {
            passwordErr = "Mật khẩu không được để trống";
        } else if (!passwordRegex.test(password)) {
            passwordErr = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt";
        }

        let confirmErr = "";
        if (confirmPassword.trim() === "") {
            confirmErr = "Vui lòng nhập lại mật khẩu";
        } else if (confirmPassword !== password) {
            confirmErr = "Mật khẩu nhập lại không khớp";
        }

        setPasswordError(passwordErr);
        setConfirmPasswordError(confirmErr);

        if (passwordErr || confirmErr) return;

        const payload: ChangePasswordRequest = {
            email: email + "".trim(),
            forgotPasswordCode: forgotPasswordCode + "".trim(),
            password,
        };

        setChanging(true);
        setChangeMessage("");
        try {
            await changePassword(payload);
            setChangeSuccess(true);
            setChangeMessage("Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.");
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            let message = "Không thể đổi mật khẩu. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            setChangeSuccess(false);
            setChangeMessage(message);
        } finally {
            setChanging(false);
        }
    };

    return (
        <div className="auth-shell">
            <section className="page-hero">
                <p className="eyebrow text-white-50">StudyShare · Quản lý mật khẩu</p>
                <h1>Tạo mật khẩu mới</h1>
                <p>Thiết lập mật khẩu mạnh để tiếp tục bảo vệ tài khoản học tập của bạn.</p>
                <div className="page-actions">
                    <Link to="/login" className="pill-link">
                        Quay về đăng nhập
                    </Link>
                </div>
            </section>

            <section className="glass-card auth-grid">
                <div className="auth-form">
                    <h2>Đặt lại mật khẩu</h2>
                    <p className="eyebrow text-muted">
                        Liên kết áp dụng cho email: <strong>{email || "Không xác định"}</strong>
                    </p>
                    {!hasValidLink && (
                        <div className="error-text mb-3">
                            Liên kết không hợp lệ hoặc thiếu thông tin. Vui lòng yêu cầu lại từ trang
                            <Link to="/forgot-password"> Quên mật khẩu</Link>.
                        </div>
                    )}
                    <div className="input-field">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                        />
                        {passwordError && <span className="error-text">{passwordError}</span>}
                    </div>

                    <div className="input-field">
                        <label>Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                        {confirmPasswordError && (
                            <span className="error-text">{confirmPasswordError}</span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="btn-elevated"
                        onClick={handleChangePassword}
                        disabled={changing || !hasValidLink}
                    >
                        {changing ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                    </button>

                    {changeMessage && (
                        <div className={changeSuccess ? "success-text" : "error-text"}>
                            {changeMessage}
                        </div>
                    )}
                </div>

                <div className="auth-note">
                    <h4>Mẹo bảo mật</h4>
                    <ul>
                        <li>Sử dụng mật khẩu tối thiểu 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
                        <li>Không sử dụng lại mật khẩu ở nhiều website khác nhau.</li>
                        <li>Kích hoạt xác thực hai bước nếu hệ thống hỗ trợ.</li>
                    </ul>
                    <p className="mt-3">
                        Đã nhớ mật khẩu? <Link to="/login">Quay lại đăng nhập</Link>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ChangePassword;
