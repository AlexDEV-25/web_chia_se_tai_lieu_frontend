import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { login } from "../../../apis/AuthApi";
import type { AuthenticationRequest } from "../../../models/request/AuthenticationRequest";
import { useNavigate } from "react-router-dom";
import { OAuthConfig } from "../../../configurations/configuration";
import { exchangeToken } from "../../../apis/GoogleApi";
import { useSearchParams } from "react-router-dom";
import type { UserResponse } from "../../../models/response/UserResponse";
import { getMyInfo } from "../../../apis/UserApi";
import axios from "axios";
interface Props {
    setToken: (value: string | null) => void
    setRoles: (value: string[]) => void
}
const Login: React.FC<Props> = ({ setToken, setRoles }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [isErrorEmail, setIsErrorEmail] = useState<string>("");
    const [isErrorPassword, setIsErrorPassword] = useState<string>("");
    const [loginError, setLoginError] = useState<string>("");

    const calledRef = useRef(false);
    const [code, setCode] = useState<string>("");
    const [searchParams] = useSearchParams();

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
            const response = await login(authenticationRequest);
            const token = response.result?.token;

            if (!token) {
                setLoginError("Đăng nhập thất bại!");
                return;
            }

            localStorage.setItem("token", token);
            setToken(token);
            try {
                const response = await getMyInfo();
                const user: UserResponse | null = response.result;
                const roles: string[] | undefined = user?.roles?.map((role) => role.name);
                localStorage.setItem("roles", JSON.stringify(roles));
                if (!user) {
                    setLoginError("Đăng nhập thất bại!");
                    return;
                }
                setRoles(roles!);
            } catch (err: any) {
                let message = "Đăng nhập thất bại. Vui lòng thử lại!";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.message ??
                        err.message ??
                        message;
                }
                setLoginError(message);
            }
            setLoginError("");
            navigate("/");
        } catch (err: any) {
            let message = "Đăng nhập thất bại. Vui lòng thử lại!";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            setLoginError(message);
        }
    };

    const handleClick = () => {
        const callbackUrl = OAuthConfig.redirectUri;
        const authUrl = OAuthConfig.authUri;
        const googleClientId = OAuthConfig.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
        window.location.href = targetUrl;
    };


    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        const codeURL = searchParams.get("code");
        if (!codeURL) return;
        setCode(codeURL);

    }, []);

    useEffect(() => {
        if (code !== "") {
            const fetchExchangeToken = async () => {
                try {
                    const data = await exchangeToken(code);
                    const token = data.result?.token;
                    if (!token) {
                        setLoginError("Đăng nhập thất bại!");
                        return;
                    }
                    localStorage.setItem("token", token);
                    setToken(token);
                    try {
                        const data = await getMyInfo();
                        const user: UserResponse | null = data.result;
                        const roles: string[] | undefined = user?.roles?.map((role) => role.name);
                        localStorage.setItem("roles", JSON.stringify(roles));
                        setRoles(roles!);
                        if (!user) {
                            setLoginError("Đăng nhập thất bại!");
                            return;
                        }
                    } catch (err: any) {
                        let message = "Đăng nhập thất bại. Vui lòng thử lại!";
                        if (axios.isAxiosError(err)) {
                            message =
                                err.response?.data?.message ??
                                err.message ??
                                message;
                        }
                        setLoginError(message);
                    }
                    navigate("/");
                } catch (err: any) {
                    let message = "Đăng nhập thất bại. Vui lòng thử lại!";
                    if (axios.isAxiosError(err)) {
                        message =
                            err.response?.data?.message ??
                            err.message ??
                            message;
                    }
                    setLoginError(message);
                }
            }
            fetchExchangeToken();
        }
    }, [code])


    return (
        <div className="auth-shell">
            <section className="page-hero">
                <p className="eyebrow text-white-50">StudyShare · Tài khoản</p>
                <h1>Chào mừng trở lại 👋</h1>
                <p>Đăng nhập để đồng bộ kho tài liệu, đánh dấu yêu thích và tải lên những bài giảng chất lượng.</p>
                <div className="page-actions">
                    <Link to="/" className="pill-link">
                        Về trang chủ
                    </Link>
                </div>
            </section>

            <section className="glass-card auth-grid-register">
                <div className="auth-image">
                    <img src="/images/login.png" alt="Đăng nhập tài khoản" />
                </div>

                <div className="auth-content">
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

                        <div className="text-end">
                            <Link to="/forgot-password" className="link-muted">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn-elevated"
                        >
                            Đăng nhập
                        </button>

                        <div className="divider">
                            <span>hoặc</span>
                        </div>

                        <button
                            type="button"
                            className="btn-google"
                            onClick={() => { handleClick() }}
                        >
                            <svg className="google-icon" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Đăng nhập với Google
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
                </div>
            </section>
        </div>
    );
};

export default Login;
