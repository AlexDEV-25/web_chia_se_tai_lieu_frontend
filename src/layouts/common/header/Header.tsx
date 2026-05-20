import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";

import { AppContext } from "../../../contexts/AppContext";
import WebSocketService from "../../../apis/WebSocketService";
import Conversation from "./components/Conversation/Conversation";
import Notification from "./components/Notificaition/Notification";


const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [valid, setValid] = useState<boolean>(false);
    const [TempKeyWords, setTempKeyWords] = useState("");
    const context = useContext(AppContext) as any;
    const token = context.token;
    const roles = context.roles;
    const avatar = context.avatar;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("roles")
        localStorage.removeItem("avatar")
        context.setToken(null);
        context.setRoles([]);
        context.setAvatar(null);
        context.setConversationId(null);
        WebSocketService.disconnect();
        navigate("/");
    };
    useEffect(() => {
        if (token === null || roles.length === 0) {
            setValid(false);
        } else {
            setValid(true);
        }
    }, [token, roles]);

    const navLinks = useMemo(() => ([
        { to: "/", label: "Tài liệu" },
        { to: "/lesson", label: "Bài giảng" },
        { to: "/favorites", label: "Kho lưu" },
    ]), []);

    const searchPlaceholder = location.pathname === "/lesson" ? "Tìm kiếm bài giảng..." : "Tìm kiếm tài liệu...";

    const handleSearch = () => {
        context.setKeyWords(TempKeyWords);
        setTempKeyWords("");
        if (location.pathname === "/lesson") {
            navigate("/lesson");
        } else {
            navigate("/");
        }
    };

    return (
        <header className="site-header">
            <Link className="brand" to="/">
                Study<span>Share</span>
            </Link>

            <nav className="nav-links">
                {navLinks.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        {item.label}
                    </NavLink>
                ))}
                {valid &&
                    <details className="upload-dropdown">
                        <summary>
                            Upload
                            <i className="fa fa-chevron-down" />
                        </summary>
                        <div className="dropdown-content">
                            <Link to="/uploadDocument">Upload Tài liệu</Link>
                            <Link to="/uploadLesson">Upload Bài giảng</Link>
                        </div>
                    </details>
                }
            </nav>

            <div className="search-box">
                <i className="fa fa-search search-icon" />

                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={TempKeyWords}
                    onChange={(e) => setTempKeyWords(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                />

                <button
                    type="button"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>
            </div>

            <div className="header-actions-wrapper">
                {token && <Conversation />}
                {token && <Notification />}
            </div>

            <div className="nav-actions">
                {token === null ? (
                    <>
                        <Link className="btn-chip ghost" to="/login">
                            Đăng nhập
                        </Link>
                        <Link className="btn-chip" to="/register">
                            Đăng ký
                        </Link>
                    </>
                ) : (
                    <div className="user-menu">
                        <details>
                            <summary>
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="user-avatar" />
                                ) : (
                                    <i className="fa fa-user-circle" />
                                )}
                            </summary>
                            <div className="user-dropdown">
                                <Link to="/myprofile">Trang cá nhân</Link>

                                {roles.length > 0 && roles.find((role: string) => role === "ADMIN") && (
                                    <Link to="/dashboard" className="admin-link">
                                        Trang Admin
                                    </Link>
                                )}
                                <hr />
                                <button type="button" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
