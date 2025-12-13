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
                <div className="row g-4">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-img-top favorite-thumb">
                                    {fav.documentThumbnailUrl ? (
                                        <img
                                            src={`http://localhost:8080/api/images/thumbnail/${fav.documentThumbnailUrl}`}
                                            alt={fav.documentTitle}
                                        />
                                    ) : (
                                        <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: 160 }}>
                                            Không có ảnh
                                        </div>
                                    )}
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{fav.documentTitle}</h5>
                                    <p className="text-muted small mb-3">
                                        Đã lưu vào: {new Date(fav.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                    <div className="mt-auto d-flex gap-2">
                                        <Link to={`/document/${fav.documentId}`} className="btn btn-primary flex-grow-1">
                                            Đọc lại
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => handleRemove(fav.id)}
                                            disabled={removingId === fav.id}
                                        >
                                            <i className="fa fa-trash" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteDocuments;
