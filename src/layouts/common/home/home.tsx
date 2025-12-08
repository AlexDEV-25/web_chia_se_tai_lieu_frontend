import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDocument } from "../../../apis/DocumentApi";
import { getAllCategory } from "../../../apis/CategoryApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { CategoryResponse } from "../../../models/response/CategoryResponse";

const Home = () => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [loadingCats, setLoadingCats] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<"all" | number>("all");
    const [showAllCategories, setShowAllCategories] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await getAllDocument();
                setDocuments(data?.resultList ?? []);
            } catch (err) {
                setError("Không thể tải tài liệu. Vui lòng thử lại.");
            } finally {
                setLoadingDocs(false);
            }
        };
        fetchDocuments();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategory();
                setCategories((data?.resultList ?? []).filter(cat => !cat.hide));
            } catch (err) {
                setError("Không thể tải danh mục. Vui lòng thử lại.");
            } finally {
                setLoadingCats(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            if (doc.status && doc.status !== "PUBLISHED") {
                return false;
            }
            const matchCategory = selectedCategory === "all" || doc.categoryId === selectedCategory;
            const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [documents, searchTerm, selectedCategory]);

    const topCategories = useMemo(() => categories.slice(0, 6), [categories]);
    const displayedCategories = showAllCategories ? categories : topCategories;
    const hasMoreCategories = categories.length > topCategories.length;

    const stats = useMemo(() => {
        const totalDownloads = documents.reduce((sum, doc) => sum + (doc.downloadsCount ?? 0), 0);
        const totalViews = documents.reduce((sum, doc) => sum + (doc.viewsCount ?? 0), 0);
        return {
            totalDocuments: documents.length,
            totalDownloads,
            totalViews,
        };
    }, [documents]);

    const shimmer = Array.from({ length: 6 });

    return (
        <div className="home-shell">
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
                                onChange={(e) => setSearchTerm(e.target.value)}
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

            <section className="categories-block">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Danh mục nổi bật</p>
                        <h2>Chọn nhanh đúng nhóm tài liệu</h2>
                    </div>
                    {hasMoreCategories && (
                        <button
                            className="btn-link"
                            onClick={() => {
                                setShowAllCategories((prev) => !prev);
                                setSelectedCategory("all");
                            }}
                        >
                            {showAllCategories ? "Thu gọn" : "Xem tất cả"}
                        </button>
                    )}
                </div>

                {loadingCats ? (
                    <div className="category-grid">
                        {shimmer.map((_, index) => (
                            <div key={index} className="category-card shimmer" />
                        ))}
                    </div>
                ) : (
                    <div className="category-grid">
                        {displayedCategories.map((category) => (
                            <button
                                key={category.id}
                                className={`category-card ${selectedCategory === category.id ? "active" : ""}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <div className="category-icon">
                                    <i className="fa fa-folder-open" />
                                </div>
                                <div>
                                    <h5>{category.name}</h5>
                                    <p>{category.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </section>

            <section className="documents-block">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Tài liệu đề xuất</p>
                        <h2>
                            {selectedCategory === "all"
                                ? "Trending tuần này"
                                : `Danh mục: ${categories.find(cat => cat.id === selectedCategory)?.name ?? ""}`}
                        </h2>
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loadingDocs ? (
                    <div className="document-grid">
                        {shimmer.map((_, index) => (
                            <div key={index} className="document-card shimmer" />
                        ))}
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="empty-state">
                        <p>Không tìm thấy tài liệu phù hợp. Hãy thử từ khóa khác nhé!</p>
                    </div>
                ) : (
                    <div className="document-grid">
                        {filteredDocuments.slice(0, 8).map((doc) => (
                            <article key={doc.id} className="document-card">
                                <div className="doc-thumbnail">
                                    <img src={`http://localhost:8080/api/images/thumbnail/${doc.thumbnailUrl}`} alt={doc.title} />
                                    <span className="doc-type">{doc.type}</span>
                                </div>
                                <div className="doc-body">
                                    <h3>{doc.title}</h3>
                                    <p>{doc.description}</p>
                                    <div className="doc-meta">
                                        <span><i className="fa fa-eye me-1" /> {doc.viewsCount}</span>
                                        <span><i className="fa fa-download me-1" /> {doc.downloadsCount}</span>
                                    </div>
                                </div>
                                <div className="doc-actions">
                                    <Link to={`/document/${doc.id}`} className="btn-pill ghost">
                                        Đọc ngay
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
