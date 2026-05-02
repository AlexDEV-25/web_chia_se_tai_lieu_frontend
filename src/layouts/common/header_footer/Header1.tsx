import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import UploadDropdown from "./components/UploadDropdown";
import ListNotification from "./components/ListNotification";

interface Props {
    token: string | null
    setToken: (value: string | null) => void
    setKeyWords: (value: string) => void
    roles: string[]
    setRoles: (value: string[]) => void
}
const Header: React.FC<Props> = ({ token, setToken, setKeyWords, roles, setRoles }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [valid, setValid] = useState<boolean>(false);
    const [TempKeyWords, setTempKeyWords] = useState("");


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("roles")
        setToken(null);
        setRoles([]);
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
        setKeyWords(TempKeyWords);
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
                {valid && <UploadDropdown />}
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

            {token && <ListNotification />}


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
                                <span className="avatar-chip">
                                    Tài khoản <i className="fa fa-chevron-down" />
                                </span>
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
