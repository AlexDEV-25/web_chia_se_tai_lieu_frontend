import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../../../utils/errorHandler";
import { changePassword } from "../../../apis/AuthApi";
import type { ChangePasswordRequest } from "../../../models/request/ChangePasswordRequest";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants/messages";

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
            setChangeMessage(ERROR_MESSAGES.INVALID_LINK);
            return;
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        let passwordErr = "";
        if (password.trim() === "") {
            passwordErr = ERROR_MESSAGES.PASSWORD_EMPTY;
        } else if (!passwordRegex.test(password)) {
            passwordErr = ERROR_MESSAGES.PASSWORD_INVALID;
        }

        let confirmErr = "";
        if (confirmPassword.trim() === "") {
            confirmErr = "Vui lòng nhập lại mật khẩu";
        } else if (confirmPassword !== password) {
            confirmErr = ERROR_MESSAGES.PASSWORD_MISMATCH;
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
            setChangeMessage(SUCCESS_MESSAGES.CHANGE_PASSWORD_SUCCESS);
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CHANGE_PASSWORD_FAILED);
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
