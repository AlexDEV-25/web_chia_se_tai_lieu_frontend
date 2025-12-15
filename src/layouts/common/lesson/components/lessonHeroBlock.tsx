type LessonStats = {
    totalLessons: number;
    totalViews: number;
    totalVideos: number;
};

type LessonHeroBlockProps = {
    stats: LessonStats;
};

const LessonHeroBlock: React.FC<LessonHeroBlockProps> = ({ stats }: LessonHeroBlockProps) => {
    return (
        <section className="hero-block">
            <div>
                <p className="eyebrow">StudyShare · Video học tập</p>
                <h1>
                    Học hiệu quả với <span>video bài giảng chất lượng</span>
                </h1>
                <p className="hero-subtitle">
                    Hàng trăm video bài giảng từ giảng viên kinh nghiệm, kèm tài liệu chi tiết.
                    Nâng cao kiến thức và kỹ năng của bạn ngay hôm nay.
                </p>
            </div>
            <div className="hero-metrics">
                <div className="metric-card">
                    <p>Video</p>
                    <strong>{stats.totalLessons}</strong>
                    <span>bài giảng</span>
                </div>
                <div className="metric-card">
                    <p>Lượt xem</p>
                    <strong>{stats.totalViews.toLocaleString("vi-VN")}</strong>
                    <span>đang học</span>
                </div>
                <div className="metric-card">
                    <p>Tài liệu</p>
                    <strong>{stats.totalVideos}</strong>
                    <span>đã sẵn sàng</span>
                </div>
            </div>
        </section>
    );
};

export default LessonHeroBlock;
