const Banner: React.FC = () => {
    return (
        <>
            <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">

                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="2"></button>
                </div>

                <div className="carousel-inner">


                    <div className="carousel-item active">
                        <img src="https://picsum.photos/1200/400?random=1" className="d-block w-100" alt="Banner 1" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="fw-bold">Kho tài liệu học tập miễn phí</h5>
                            <p>Chia sẻ – Học tập – Cùng nhau phát triển</p>
                        </div>
                    </div>


                    <div className="carousel-item">
                        <img src="https://picsum.photos/1200/400?random=2" className="d-block w-100" alt="Banner 2" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="fw-bold">Tải lên và chia sẻ tài liệu dễ dàng</h5>
                            <p>Hỗ trợ PDF, Word, PowerPoint, ZIP…</p>
                        </div>
                    </div>


                    <div className="carousel-item">
                        <img src="https://picsum.photos/1200/400?random=3" className="d-block w-100" alt="Banner 3" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="fw-bold">Tìm kiếm tài liệu theo môn học</h5>
                            <p>Nhanh chóng – Chính xác – Tiện lợi</p>
                        </div>
                    </div>

                </div>


                <button className="carousel-control-prev" type="button" data-bs-slide="prev" data-bs-target="#bannerCarousel">
                    <span className="carousel-control-prev-icon"></span>
                </button>

                <button className="carousel-control-next" type="button" data-bs-slide="next" data-bs-target="#bannerCarousel">
                    <span className="carousel-control-next-icon"></span>
                </button>

            </div>

        </>
    );
}

export default Banner;