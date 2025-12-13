import { useState } from "react";
import { checkEmailExist, checkUsernameExist } from "../../../apis/UserApi";
import { register } from "../../../apis/AuthApi";
import type { UserRequest } from "../../../models/request/UserRequest";

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
        const now = new Date().toISOString();

        const newUser: UserRequest = {
            username: username, email: email, password: password, verified: false,
            createdAt: now, updatedAt: now, roles: ["USER"], hide: false
        };

        try {
            const data = await register(newUser);
            console.log(data);

            setUsername("");
            setEmail("");
            setPassword("");
            setRePassword("");
            setIsSuccess("Đăng ký thành công vui lòng vào Email để kích hoạt tài khoản!");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="text-center mb-4">Đăng ký tài khoản</h2>

            <div style={{ color: "green" }}>{isSuccess}</div>

            {/* USERNAME */}
            <div className="mb-3">
                <label className="form-label">Tên người dùng</label>
                <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên người dùng"
                />
                <div style={{ color: "red" }}>{isErrorUsername}</div>
            </div>

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

            {/* RE-PASSWORD */}
            <div className="mb-3">
                <label className="form-label">Nhập lại mật khẩu</label>
                <input
                    type="password"
                    className="form-control"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                />
                <div style={{ color: "red" }}>{isErrorRePassword}</div>
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary w-100"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
        </div>
    );
};

export default Register;
