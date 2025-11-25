function Header() {
    return (
        <nav className="navbar navbar-expand-lg bg-light shadow-sm sticky-top">
            <div className="container">

                <a className="navbar-brand fw-bold" href="#">
                    StudyShare
                </a>


                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><a className="nav-link" href="#">Tài liệu</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Môn học</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Upload</a></li>
                    </ul>


                    <form className="d-flex me-3" role="search">
                        <input className="form-control" type="search" placeholder="Tìm kiếm..." />
                    </form>

                    <a className="btn btn-primary" href="#">Đăng nhập</a>
                </div>
            </div>
        </nav>

    );
}

export default Header;