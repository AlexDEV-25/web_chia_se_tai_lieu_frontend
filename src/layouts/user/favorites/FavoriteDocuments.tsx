import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FavoriteResponse } from "../../../models/response/FavoriteResponse";
import { getFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";

const FavoriteDocuments: React.FC = () => {
    const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    const formatSavedDate = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Không xác định";
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setFavorites([]);
            return;
        }

        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getFavoritesByUser();
                setFavorites(response.resultList ?? []);
            } catch (err) {
                console.error("fetchFavorites error", err);
                setError("Không thể tải kho lưu. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token]);

    const handleRemove = async (favoriteId: number) => {
        setRemovingId(favoriteId);
        try {
            await removeFavorite(favoriteId);
            setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
        } catch (err) {
            console.error("removeFavorite error", err);
            alert("Không thể xóa tài liệu khỏi kho lưu. Vui lòng thử lại.");
        } finally {
            setRemovingId(null);
        }
    };

    if (!token) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    <p className="mb-3">Bạn cần đăng nhập để xem kho tài liệu đã lưu.</p>
                    <Link className="btn btn-primary" to="/login">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 favorite-documents-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <p className="text-muted mb-1">Kho lưu cá nhân</p>
                    <h2 className="fw-bold">Tài liệu yêu thích</h2>
                </div>
                <Link to="/" className="btn btn-outline-secondary">
                    <i className="fa fa-arrow-left me-2" /> Về trang chủ
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="row g-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="col-md-4">
                            <div className="card placeholder-glow" style={{ minHeight: 200 }}>
                                <div className="card-body">
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-5"></span>
                                    <span className="placeholder col-6"></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-5">
                    <p className="mb-3">Bạn chưa lưu tài liệu nào. Khám phá và lưu về để xem sau!</p>
                    <Link to="/" className="btn btn-primary">
                        Khám phá tài liệu
                    </Link>
                </div>
            ) : (
                <section className="documents-block compact">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Danh sách đã lưu</p>
                            <h3>Bộ sưu tập của bạn</h3>
                        </div>
                        <span className="chip ghost">{favorites.length}</span>
                    </div>

                    <div className="document-grid three-col favorites-grid">
                        {favorites.map((fav) => (
                            <article key={fav.id} className="document-card compact simple">
                                <Link to={`/document/${fav.documentId}`} className="doc-thumbnail">
                                    {fav.documentThumbnailUrl ? (
                                        <img
                                            src={`http://localhost:8080/api/images/thumbnail/${fav.documentThumbnailUrl}`}
                                            alt={fav.documentTitle}
                                        />
                                    ) : (
                                        <div className="thumb-placeholder">Không có ảnh</div>
                                    )}
                                    <span className="doc-type">Kho lưu</span>
                                </Link>
                                <div className="doc-meta d-flex justify-content-between align-items-center">
                                    <div className="d-flex flex-column fw-semibold text-dark">
                                        <div>
                                            <i className="fa fa-user me-1 text-secondary" /> by: {fav.authorName}
                                        </div>
                                        <div>
                                            <i className="fa fa-clock-o me-1 text-secondary" /> {formatSavedDate(fav.createdAt)}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="favorite-remove-btn"
                                        onClick={() => handleRemove(fav.id)}
                                        disabled={removingId === fav.id}
                                        aria-label="Xóa khỏi kho lưu"
                                    >
                                        <i className="fa fa-trash" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default FavoriteDocuments;
