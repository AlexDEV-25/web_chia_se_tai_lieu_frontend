import { useEffect, useState } from "react";
import api from "../../../apis/HttpClient";
import type { UserResponse } from "../../../models/response/UserResponse";

const MyProfile: React.FC = () => {
    const [user, setUser] = useState<UserResponse | null>(null);

    // Input
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avt, setAvt] = useState<File | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Ẩn/hiện đổi mật khẩu
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Errors
    const [errNewPassword, setErrNewPassword] = useState("");
    const [errConfirmPassword, setErrConfirmPassword] = useState("");

    const [successMsg, setSuccessMsg] = useState("");


    // ================= GET MY INFO =================
    const fetchMyInfo = async () => {
        try {
            const res = await api.get("/users/my-info");
            setUser(res.data.result);
            setUsername(res.data.result.username);
            setEmail(res.data.result.email);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMyInfo();
    }, []);
    const handleUpdate = async () => {
        let uErr = "";
        let eErr = "";
        let pErr1 = "";
        let pErr2 = "";

        if (username.trim() === "") uErr = "Username không được để trống";
        if (email.trim() === "") eErr = "Email không được để trống";

        // Chỉ validate nếu user bật đổi mật khẩu
        if (showChangePassword && newPassword.trim() !== "") {
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(newPassword)) {
                pErr1 = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt";
            }
            if (confirmPassword.trim() === "") {
                pErr2 = "Vui lòng nhập lại mật khẩu";
            } else if (confirmPassword !== newPassword) {
                pErr2 = "Mật khẩu nhập lại không khớp";
            }
        }

        setErrNewPassword(pErr1);
        setErrConfirmPassword(pErr2);

        if (uErr || eErr || pErr1 || pErr2) return;
        if (!user) return;

        const finalPassword =
            showChangePassword && newPassword.trim() !== ""
                ? newPassword
                : user.password;

        const data = {
            username,
            email,
            roles: user.roles.map((r) => r.name),
            password: finalPassword,
        };

        const formData = new FormData();
        if (avt) formData.append("avt", avt);
        formData.append("data", JSON.stringify(data));

        try {
            await api.put(`/users/my-info`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccessMsg("Cập nhật thành công!");
            fetchMyInfo();

            // reset nếu tắt đổi mật khẩu
            setNewPassword("");
            setConfirmPassword("");
            setShowChangePassword(false);

        } catch (err) {
            console.error(err);
            setSuccessMsg("Cập nhật thất bại!");
        }
    };


    if (!user) {
        return (
            <div className="container mt-5">
                <h3>Đang tải...</h3>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "700px" }}>
            <h2 className="text-center mb-4">Hồ sơ cá nhân</h2>

            <div className="card p-4 shadow-sm">

                {/* AVATAR */}
                <div className="text-center mb-4">
                    <img
                        src={`http://localhost:8080/api/images/avatar/${user.avatarUrl}`}
                        alt="avatar"
                        style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "3px solid #ddd", }}
                    />
                </div>

                <div style={{ color: "green", marginBottom: 10 }}>{successMsg}</div>

                {/* USERNAME */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Username</label>
                    <input type="text" className="form-control" value={username} readOnly />
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input type="email" className="form-control" value={email} readOnly />
                </div>

                {/* ROLES */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Quyền</label>
                    <ul>
                        {user.roles.map((r) => (
                            <li key={r.name}>{r.name}</li>
                        ))}
                    </ul>
                </div>

                {/* DATES */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Ngày tạo</label>
                    <div>{new Date(user.createdAt).toLocaleString()}</div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Cập nhật lần cuối</label>
                    <div>{new Date(user.updatedAt).toLocaleString()}</div>
                </div>

                {/* UPDATE AVATAR */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Cập nhật Avatar</label>
                    <input type="file" accept="image/*" className="form-control" onChange={(e) => setAvt(e.target.files?.[0] || null)} />
                </div>

                {/* BUTTON TOGGLE CHANGE PASSWORD */}
                <div className="text-end">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        onClick={() => {
                            if (showChangePassword) {
                                setNewPassword("");
                                setConfirmPassword("");
                                setErrNewPassword("");
                                setErrConfirmPassword("");
                            }
                            setShowChangePassword(!showChangePassword);
                        }}
                    >
                        {showChangePassword ? "Hủy" : "Đổi mật khẩu"}
                    </button>
                </div>

                {/* SHOW / HIDE PASSWORD FIELDS */}
                {showChangePassword && (
                    <>
                        <h5 className="fw-bold mt-3">Đổi mật khẩu</h5>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <div style={{ color: "red" }}>{errNewPassword}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <div style={{ color: "red" }}>{errConfirmPassword}</div>
                        </div>
                    </>
                )}

                <button className="btn btn-primary w-100 mt-3" onClick={handleUpdate}>
                    Cập nhật thông tin
                </button>
            </div>
        </div>
    );
};

export default MyProfile;
