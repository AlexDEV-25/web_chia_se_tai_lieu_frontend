import { useState } from "react";
import { login } from "../../../apis/AuthApi";
import AuthenticationRequest from "../../../models/request/AuthenticationRequest";
import { useNavigate } from "react-router-dom";
const Login: React.FC = () => {
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

        const authenticationRequest = new AuthenticationRequest(email, password);
        try {
            console.log(authenticationRequest);
            const data = await login(authenticationRequest);
            console.log(data);
            const token = data.result?.token;

            if (!token) {
                setLoginError("Đăng nhập thất bại!");
                return;
            }

            localStorage.setItem("token", token);

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
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="text-center mb-4">Đăng ký tài khoản</h2>

            <div style={{ color: "red" }}>{loginError}</div>

            {/* EMAIL */}
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                />
                <div style={{ color: "red" }}>{isErrorEmail}</div>
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                />
                <div style={{ color: "red" }}>{isErrorPassword}</div>
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary w-100"
            >
                Đăng nhập
            </button>
        </div>
    );
};

export default Login;
