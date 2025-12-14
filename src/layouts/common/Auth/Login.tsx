import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../../apis/AuthApi";
import type { AuthenticationRequest } from "../../../models/request/AuthenticationRequest";
import { useNavigate } from "react-router-dom";
interface Props {
    setToken: (value: string | null) => void
}
const Login: React.FC<Props> = ({ setToken }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isErrorEmail, setIsErrorEmail] = useState<string>("");
    const [isErrorPassword, setIsErrorPassword] = useState<string>("");
    const [loginError, setLoginError] = useState<string>("");

    // ================= HANDLE SUBMIT =================
    const handleSubmit = async () => {
        let emailError = "";
        let passwordError = "";
        if (email.trim() === "") {
            emailError = "Email không được để trống";
        }

        if (password.trim() === "") {
            passwordError = "Mật khẩu không được để trống";
        }

        setIsErrorEmail(emailError);
        setIsErrorPassword(passwordError);


        // STOP
        if (emailError || passwordError) return;

        const authenticationRequest: AuthenticationRequest = { email: email, password: password };
        try {
            const data = await login(authenticationRequest);
            const token = data.result?.token;

            if (!token) {
                setLoginError("Đăng nhập thất bại!");
                return;
            }

            localStorage.setItem("token", token);
            setToken(token);
            setLoginError("");
            navigate("/");
        } catch (error: any) {
            const msg =
                error.response?.data?.message ||
                "Đăng nhập thất bại. Vui lòng kiểm tra lại!";

            setLoginError(msg);

        }
    };

    return (
        <div className="auth-shell">
            <section className="page-hero glass-card">
                <p className="eyebrow text-white-50">StudyShare · Tài khoản</p>
                <h1>Chào mừng trở lại 👋</h1>
                <p>Đăng nhập để đồng bộ kho tài liệu, đánh dấu yêu thích và tải lên những bài giảng chất lượng.</p>
                <div className="page-actions">
                    <Link to="/" className="pill-link">
                        Về trang chủ
                    </Link>
                </div>
            </section>

            <section className="glass-card auth-grid">
                <div className="auth-form">
                    <h2>Đăng nhập</h2>
                    {loginError && <div className="error-text">{loginError}</div>}

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

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn-elevated"
                    >
                        Đăng nhập
                    </button>
                </div>

                <div className="auth-note">
                    <h4>Vì sao nên tạo tài khoản?</h4>
                    <ul>
                        <li>Lưu tài liệu yêu thích và xem nhanh.</li>
                        <li>Tải lên tài liệu của bạn cho cộng đồng.</li>
                        <li>Nhận đề xuất cá nhân hóa theo môn học.</li>
                    </ul>
                    <p className="mt-3">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Login;
