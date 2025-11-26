import { useState } from "react";
import { checkEmailExist } from "../../../../apis/UserApi";
import { register } from "../../../../apis/RequestApi";
import { User } from "../../../../models/User";
const Register: React.FC = () => {
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rePassword, setRePassword] = useState<string>("");
    const [isErrorFullName, setIsErrorFullName] = useState<string>("");
    const [isErrorEmail, setIsErrorEmail] = useState<string>("");
    const [isErrorPassword, setIsErrorPassword] = useState<string>("");
    const [isErrorRePassword, setIsErrorRePassword] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<string>("");
    const handleSubmit = async () => {
        let fullNameError = "";
        let emailError = "";
        let passwordError = "";
        let rePasswordError = "";

        // FULL NAME
        if (fullName.trim() === "") {
            fullNameError = "Họ và tên không được để trống";
        } else if (fullName.trim().length < 2) {
            fullNameError = "Họ và tên quá ngắn";
        } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(fullName.trim())) {
            fullNameError = "Họ và tên không được chứa số hoặc ký tự đặc biệt";
        } else if (fullName.trim().length > 50) {
            fullNameError = "Họ và tên quá dài";
        }


        // EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            emailError = "Email không được để trống";
        } else if (!emailRegex.test(email.trim())) {
            emailError = "Email không hợp lệ";
        } else {
            const exist = await checkEmailExist(email.trim());
            if (exist) emailError = "Email đã tồn tại";
        }


        // PASSWORD
        // Regex: có hoa, thường, số, ký tự đặc biệt, >= 8 ký tự
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (password.trim() === "") {
            passwordError = "Mật khẩu không được để trống";
        } else if (password.length < 8) {
            passwordError = "Mật khẩu phải từ 8 ký tự trở lên";
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

        setIsErrorFullName(fullNameError);
        setIsErrorEmail(emailError);
        setIsErrorPassword(passwordError);
        setIsErrorRePassword(rePasswordError);

        if (fullNameError || emailError || passwordError || rePasswordError) {
            return;
        }
        const newUser = new User(0, fullName, email, password, false, "", "", "", "", "USER", false);
        await register(newUser).then((data) => {
            console.log(data);
            setFullName("");
            setEmail("");
            setPassword("");
            setRePassword("");
            setIsSuccess("dang ky thanh cong")
        }).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div>
            <div className="container mt-5" style={{ maxWidth: "500px" }}>
                <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
                <div ><div className="mb-3">
                    <div style={{ color: "green" }}>{isSuccess}</div>
                </div>
                    {/* Username */}
                    <div className="mb-3">
                        <label className="form-label">Tên người dùng</label>
                        <input
                            type="text"
                            className="form-control"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nhập tên người dùng"
                        />
                        <div style={{ color: "red" }}>{isErrorFullName}</div>
                    </div>

                    {/* Email */}
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

                    {/* Password */}
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

                    {/* Re-Password */}
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
                        className="btn btn-primary w-100">
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;