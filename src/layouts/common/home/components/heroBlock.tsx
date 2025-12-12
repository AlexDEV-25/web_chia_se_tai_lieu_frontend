import { Link } from "react-router-dom";

type Stats = {
    totalDocuments: number;
    totalDownloads: number;
    totalViews: number;
};

type HeroBlockProps = {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    stats: Stats;
};

const HeroBlock = ({ searchTerm, onSearchChange, stats }: HeroBlockProps) => {
    return (
        <section className="hero-block">
            <div>
                <p className="eyebrow">StudyShare · Kho chia sẻ học tập</p>
                <h1>
                    Đón đầu kỳ thi cùng bộ <span>tài liệu chuẩn hóa</span>
                </h1>
                <p className="hero-subtitle">
                    Hàng trăm tài liệu mới được cập nhật mỗi tuần, phân loại rõ ràng theo học phần & kỹ năng.
                    Khám phá ngay hôm nay để bắt kịp tiến độ học tập của bạn.
                </p>
                <div className="hero-actions">
                    <div className="search-pill">
                        <i className="fa fa-search" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu, môn học, từ khóa..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <Link to="/upload" className="btn-pill primary">
                        <i className="fa fa-upload me-2" />
                        Upload tài liệu
                    </Link>
                </div>
            </div>
            <div className="hero-metrics">
                <div className="metric-card">
                    <p>Tài liệu</p>
                    <strong>{stats.totalDocuments}</strong>
                    <span>đã sẵn sàng</span>
                </div>
                <div className="metric-card">
                    <p>Lượt tải</p>
                    <strong>{stats.totalDownloads.toLocaleString("vi-VN")}</strong>
                    <span>từ cộng đồng</span>
                </div>
                <div className="metric-card">
                    <p>Lượt xem</p>
                    <strong>{stats.totalViews.toLocaleString("vi-VN")}</strong>
                    <span>đang học</span>
                </div>
            </div>
        </section>
    );
};

export default HeroBlock;
