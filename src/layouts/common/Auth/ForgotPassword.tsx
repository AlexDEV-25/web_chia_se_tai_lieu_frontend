import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { forgotPassword } from "../../../apis/AuthApi";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (value: string) => {
        if (value.trim() === "") {
            return "Email không được để trống";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
            return "Email không hợp lệ";
        }
        return "";
    };

    const handleSubmit = async () => {
        const err = validateEmail(email);
        setEmailError(err);
        if (err) return;

        setLoading(true);
        setMessage("");
        try {
            await forgotPassword(email.trim());
            setSuccess(true);
            setMessage("Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.");
        } catch (err: any) {
            let msg = "Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                msg =
                    err.response?.data?.message ??
                    err.message ??
                    msg;
            }
            setSuccess(false);
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            <section className="page-hero">
                <p className="eyebrow text-white-50">StudyShare · Khôi phục mật khẩu</p>
                <h1>Lấy lại quyền truy cập</h1>
                <p>Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu từ hệ thống.</p>
                <div className="page-actions">
                    <Link to="/login" className="pill-link">
                        Quay về đăng nhập
                    </Link>
                </div>
            </section>

            <section className="glass-card auth-grid">
                <div className="auth-form">
                    <h2>Quên mật khẩu</h2>
                    <div className="input-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                        />
                        {emailError && <span className="error-text">{emailError}</span>}
                    </div>

                    <button
                        type="button"
                        className="btn-elevated"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Đang gửi yêu cầu..." : "Gửi liên kết khôi phục"}
                    </button>

                    {message && (
                        <div className={success ? "success-text" : "error-text"}>
                            {message}
                        </div>
                    )}
                </div>

                <div className="auth-note">
                    <h4>Lưu ý</h4>
                    <ul>
                        <li>Liên kết chỉ có hiệu lực trong thời gian giới hạn.</li>
                        <li>Kiểm tra cả hộp thư spam nếu chưa thấy email.</li>
                        <li>Không chia sẻ liên kết đặt lại mật khẩu cho người khác.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;