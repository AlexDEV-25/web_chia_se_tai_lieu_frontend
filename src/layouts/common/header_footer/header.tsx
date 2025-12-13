import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
interface Props {
    token: string | null
    setToken: (value: string | null) => void
}
const Header: React.FC<Props> = ({ token, setToken }) => {
    const navigate = useNavigate();
    const [valid, setValid] = useState<boolean>(false);

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
    }, [token])


    return (
        <nav className="navbar navbar-expand-lg bg-light shadow-sm sticky-top">
            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">StudyShare</Link>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Tài liệu</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/">Bài giảng</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/favorites">Kho lưu</Link></li>
                        {valid && <li className="nav-item"><Link className="nav-link" to="/upload">Upload</Link></li>}
                    </ul>

                    <form className="d-flex me-3" role="search">
                        <input className="form-control" type="search" placeholder="Tìm kiếm..." />
                    </form>

                    {token === null ? (
                        <div className="d-flex gap-2">
                            <Link className="btn btn-primary" to="/login">Đăng nhập</Link>
                            <Link className="btn btn-outline-primary" to="/register">Đăng ký</Link>
                        </div>
                    ) : (
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                Tài khoản
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                                <li><Link className="dropdown-item" to="/upload">Upload tài liệu</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Header;
