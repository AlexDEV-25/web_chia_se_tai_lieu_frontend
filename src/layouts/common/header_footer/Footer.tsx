function Footer() {
    return (
        <footer className="bg-light text-dark pt-4 mt-5 border-top">
            <div className="container">

                <div className="row">

                    <div className="col-md-4 mb-3">
                        <h5 className="fw-bold">StudyShare</h5>
                        <p className="text-muted">
                            Nền tảng chia sẻ tài liệu học tập miễn phí dành cho sinh viên và học sinh.
                        </p>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h6 className="fw-bold">Liên kết nhanh</h6>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-dark text-decoration-none">Tài liệu mới nhất</a></li>
                            <li><a href="#" className="text-dark text-decoration-none">Môn học</a></li>
                            <li><a href="#" className="text-dark text-decoration-none">Top tải nhiều</a></li>
                            <li><a href="#" className="text-dark text-decoration-none">Tải lên tài liệu</a></li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h6 className="fw-bold">Liên hệ</h6>
                        <ul className="list-unstyled">
                            <li>Email: support@studyshare.com</li>
                            <li>Hotline: 0123 456 789</li>
                            <li>Facebook: StudyShare.vn</li>
                        </ul>
                    </div>
                </div>


                <div className="text-center py-3 border-top mt-3 text-muted">
                    © 2025 StudyShare. All rights reserved.
                </div>

            </div>
        </footer>

    );
}
export default Footer;
