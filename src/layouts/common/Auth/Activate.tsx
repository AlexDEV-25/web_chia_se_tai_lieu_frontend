import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { activateUser } from "../../../apis/AuthApi";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { ActiveAccountRequest } from "../../../models/request/ActiveAccountRequest";
const Activate: React.FC = () => {
    const { email } = useParams();
    const { activationCode } = useParams();
    const [activated, setActivated] = useState<boolean>(false);
    const [notification, setNotification] = useState("");
    const isCalled = useRef(false);
    useEffect(() => {
        if (isCalled.current) return;
        isCalled.current = true;
        if (email && activationCode) {
            activate();
        }
    }, [])

    const activate = async () => {
        try {
            const data: ActiveAccountRequest = {
                email: email + "",
                activationCode: activationCode + ""
            }
            const response = await activateUser(data);
            if (response.code === 1000) {
                setActivated(true);
            } else {
                setNotification(response.message);
            }
        } catch (err: any) {
            let message = "Không thể kích hoạt tài khoản. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            console.log(message);
        }
    }
    return (
        <div className="auth-shell">
            <section className="page-hero">
                <p className="eyebrow text-white-50">StudyShare · Kích hoạt</p>
                <h1>Kích hoạt tài khoản</h1>
                <p>Hoàn tất việc kích hoạt để bắt đầu sử dụng mọi tính năng của nền tảng.</p>
                <div className="page-actions">
                    <Link to="/" className="pill-link">
                        Về trang chủ
                    </Link>
                </div>
            </section>

            <section className="glass-card auth-grid">
                <div className="auth-form">
                    <h2>Kích hoạt tài khoản</h2>
                    {activated ? (
                        <div className="success-text">
                            Tài khoản đã kích hoạt thành công, bạn hãy đăng nhập để tiếp tục sử dụng dịch vụ!
                        </div>
                    ) : (
                        <div className="error-text">{notification}</div>
                    )}
                    <Link to="/login" className="btn-elevated">
                        Đăng nhập ngay
                    </Link>
                </div>

                <div className="auth-note">
                    <h4>Bước tiếp theo?</h4>
                    <ul>
                        <li>Khám phá kho tài liệu hàng nghìn tài liệu.</li>
                        <li>Lưu lại các tài liệu yêu thích để xem nhanh.</li>
                        <li>Tải lên và chia sẻ tài liệu của bạn.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
export default Activate;