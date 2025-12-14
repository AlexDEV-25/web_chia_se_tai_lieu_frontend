import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext, type AppContextType } from "../../../AppContext";
interface Props {
    token: string | null
    setToken: (value: string | null) => void
}
const Header: React.FC<Props> = ({ token, setToken }) => {
    const navigate = useNavigate();
    const [valid, setValid] = useState<boolean>(false);
    const ctx = useContext(AppContext) as AppContextType | null;
    const [searchValue, setSearchValue] = useState(ctx?.keyWords ?? "");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };
    useEffect(() => {
        if (token === null) {
            setValid(false);
        } else {
            setValid(true);
        }
    }, [token]);

    useEffect(() => {
        setSearchValue(ctx?.keyWords ?? "");
    }, [ctx?.keyWords]);

    const navLinks = useMemo(() => ([
        { to: "/", label: "Tài liệu" },
        { to: "/favorites", label: "Kho lưu" },
        { to: "/upload", label: "Upload", restricted: true },
    ]), []);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        ctx?.setKeyWords(value);
    };

    return (
        <header className="site-header">
            <Link className="brand" to="/">
                Study<span>Share</span>
            </Link>

            <nav className="nav-links">
                {navLinks.map((item) => {
                    if (item.restricted && !valid) return null;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="nav-search">
                <i className="fa fa-search text-muted" />
                <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
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
                                <span className="avatar-chip">
                                    Tài khoản
                                </span>
                            </summary>
                            <div className="user-dropdown">
                                <Link to="/profile">Thông tin cá nhân</Link>
                                <Link to="/upload">Upload tài liệu</Link>
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
