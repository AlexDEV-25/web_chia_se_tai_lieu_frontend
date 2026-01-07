import { useState } from "react";
import { Link } from "react-router-dom";
import { checkEmailExist, checkUsernameExist } from "../../../apis/UserApi";
import { register } from "../../../apis/AuthApi";
import type { UserRequest } from "../../../models/request/UserRequest";
import axios from "axios";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rePassword, setRePassword] = useState<string>("");

    const [isErrorUsername, setIsErrorUsername] = useState<string>("");
    const [isErrorEmail, setIsErrorEmail] = useState<string>("");
    const [isErrorPassword, setIsErrorPassword] = useState<string>("");
    const [isErrorRePassword, setIsErrorRePassword] = useState<string>("");

    const [isSuccess, setIsSuccess] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // ================= HANDLE SUBMIT =================
    const handleSubmit = async () => {
        if (isLoading) return;

        setIsLoading(true);

        let usernameError = "";
        let emailError = "";
        let passwordError = "";
        let rePasswordError = "";

        // USERNAME
        if (username.trim() === "") {
            usernameError = "Tên người dùng không được để trống";
        } else if (username.trim().length < 2) {
            usernameError = "Tên người dùng quá ngắn";
        } else if (username.trim().length > 50) {
            usernameError = "Tên người dùng quá dài";
        } else {
            const exist = await checkUsernameExist(username.trim());
            if (exist.result) usernameError = "Tên người dùng đã tồn tại";
        }

        // EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.trim() === "") {
            emailError = "Email không được để trống";
        } else if (!emailRegex.test(email.trim())) {
            emailError = "Email không hợp lệ";
        } else {
            const exist = await checkEmailExist(email.trim());
            if (exist.result) emailError = "Email đã tồn tại";
        }

        // PASSWORD
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password.trim() === "") {
            passwordError = "Mật khẩu không được để trống";
        } else if (!passwordRegex.test(password)) {
            passwordError =
                "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt";
        }

        // RE-PASSWORD
        if (rePassword.trim() === "") {
            rePasswordError = "Vui lòng nhập lại mật khẩu";
        } else if (rePassword !== password) {
            rePasswordError = "Mật khẩu nhập lại không khớp";
        }

        // SET ERROR
        setIsErrorUsername(usernameError);
        setIsErrorEmail(emailError);
        setIsErrorPassword(passwordError);
        setIsErrorRePassword(rePasswordError);

        // STOP
        if (usernameError || emailError || passwordError || rePasswordError) {
            setIsLoading(false);
            return;
        }

        // ================= CREATE REQUEST OBJECT =================
        const newUser: UserRequest = {
            username: username,
            email: email,
            password: password,
            verified: false,
            roles: ["USER"],
            hide: false
        };

        try {
            await register(newUser);
            setUsername("");
            setEmail("");
            setPassword("");
            setRePassword("");
            setIsSuccess("Đăng ký thành công vui lòng vào Email để kích hoạt tài khoản!");
        } catch (err: any) {
            let message = "Không thể đăng ký tài khoản. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            console.log(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            <section className="page-hero">
                <p className="eyebrow text-white-50">StudyShare · Thành viên</p>
                <h1>Tạo tài khoản học tập thông minh</h1>
                <p>Tham gia cộng đồng hơn 10.000 sinh viên đang chia sẻ tài liệu, đề thi và bài giảng chuẩn hóa.</p>
                <div className="page-actions">
                    <Link to="/login" className="pill-link">
                        Đã có tài khoản? Đăng nhập
                    </Link>
                </div>
            </section>

            <section className="glass-card auth-grid-register">
                <div className="auth-image">
                    <img src="/images/register.png" alt="Đăng ký tài khoản" />
                </div>

                <div className="auth-content">
                    <div className="auth-form">
                        <h2>Đăng ký tài khoản</h2>
                        {isSuccess && <div className="success-text">{isSuccess}</div>}

                        <div className="input-field">
                            <label>Tên người dùng</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập tên người dùng"
                            />
                            {isErrorUsername && <span className="error-text">{isErrorUsername}</span>}
                        </div>

                        <div className="input-field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                            />
                            {isErrorEmail && <span className="error-text">{isErrorEmail}</span>}
                        </div>

                        <div className="input-field">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                            />
                            {isErrorPassword && <span className="error-text">{isErrorPassword}</span>}
                        </div>

                        <div className="input-field">
                            <label>Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                            />
                            {isErrorRePassword && <span className="error-text">{isErrorRePassword}</span>}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn-elevated"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </div>

                    <div className="auth-note">
                        <h4>Quyền lợi thành viên</h4>
                        <ul>
                            <li>Quản lý hồ sơ cá nhân & avatar.</li>
                            <li>Tham gia thảo luận, chia sẻ tài liệu, đề thi và bài giảng.</li>
                            <li>Xem tìm kiếm, tải xuống và đánh giá tài liệu.</li>
                            <li>Lưu trữ tài liệu yêu thích vào kho riêng.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;
