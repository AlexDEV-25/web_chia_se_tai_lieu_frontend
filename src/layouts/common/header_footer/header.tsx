import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

interface Props {
    token: string | null
    setToken: (value: string | null) => void
    keyWords: string
    setKeyWords: (value: string) => void
}
const Header: React.FC<Props> = ({ token, setToken, keyWords, setKeyWords }) => {
    const navigate = useNavigate();
    const [valid, setValid] = useState<boolean>(false);
    const [TempKeyWords, setTempKeyWords] = useState("");


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
        setKeyWords(keyWords);
    }, [keyWords]);

    const navLinks = useMemo(() => ([
        { to: "/", label: "Tài liệu" },
        { to: "/favorites", label: "Kho lưu" },
        { to: "/upload", label: "Upload", restricted: true },
    ]), []);
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

            <div className="search-box">
                <i className="fa fa-search search-icon" />

                <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={TempKeyWords}
                    onChange={(e) => setTempKeyWords(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => setKeyWords(TempKeyWords)}
                >
                    Tìm kiếm
                </button>
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
