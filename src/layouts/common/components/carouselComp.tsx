import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDocumentByCategory } from "../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { FavoriteResponse } from "../../../models/response/FavoriteResponse";
import { addFavorite, getFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import { getMyInfo } from "../../../apis/UserApi";

interface CarouselProps {
    categoryId: number;
    currentDocumentId: number;
}

type FavoriteMap = Record<number, { favoriteId: number }>;

const CarouselComp: React.FC<CarouselProps> = ({ categoryId, currentDocumentId }) => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllDocumentByCategory(categoryId);
                const list = (response.resultList ?? []).filter(
                    (doc) => doc.id !== currentDocumentId && doc.status === "PUBLISHED"
                );
                setDocuments(list.slice(0, 8));
            } catch (err) {
                console.error("DocumentCarousel error", err);
                setError("Không thể tải tài liệu cùng danh mục.");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchByCategory();
        }
    }, [categoryId, currentDocumentId]);

    useEffect(() => {
        if (!token) {
            setCurrentUserId(null);
            setFavoriteMap({});
            return;
        }

        const fetchFavorites = async () => {
            try {
                const user = await getMyInfo();
                setCurrentUserId(user?.result?.id ?? null);

                const favoritesResponse = await getFavoritesByUser();
                const map: FavoriteMap = {};
                (favoritesResponse.resultList ?? []).forEach((fav: FavoriteResponse) => {
                    if (fav.documentId) {
                        map[fav.documentId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err) {
                console.error("Không thể tải kho lưu", err);
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [token]);

    const handleToggleFavorite = async (doc: DocumentResponse) => {
        if (!currentUserId) {
            alert("Vui lòng đăng nhập để lưu tài liệu yêu thích.");
            return;
        }

        const existing = favoriteMap[doc.id];
        setFavoriteLoadingId(doc.id);

        try {
            if (existing) {
                await removeFavorite(existing.favoriteId);
                setFavoriteMap((prev) => {
                    const { [doc.id]: _removed, ...rest } = prev;
                    return rest;
                });
            } else {
                const response = await addFavorite({
                    userId: currentUserId,
                    documentId: doc.id,
                });
                const saved = response.result;
                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [doc.id]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err) {
            console.error("Favorite toggle error", err);
            alert("Không thể cập nhật kho lưu. Vui lòng thử lại.");
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const hasDocuments = documents.length > 0;

    if (!categoryId) return null;

    return (
        <section className="documents-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Đề xuất thêm</p>
                    <h2>Tài liệu cùng danh mục</h2>
                </div>
            </div>

            {loading && <div className="empty-state">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !hasDocuments && (
                <div className="empty-state">Chưa có tài liệu phù hợp.</div>
            )}

            {hasDocuments && (
                <div className="document-grid">
                    {documents.map((doc) => {
                        const isFavorite = Boolean(favoriteMap[doc.id]);
                        const isLoadingFavorite = favoriteLoadingId === doc.id;
                        return (
                            <article key={doc.id} className="document-card">
                                <div className="doc-thumbnail">
                                    <img src={`http://localhost:8080/api/images/thumbnail/${doc.thumbnailUrl}`} alt={doc.title} />
                                    <span className="doc-type">PDF</span>
                                </div>
                                <div className="doc-body">
                                    <h3>{doc.title}</h3>
                                    <p>{doc.description ?? "Tài liệu chưa có mô tả."}</p>
                                    <div className="doc-meta">
                                        <span><i className="fa fa-eye me-1" /> {doc.viewsCount}</span>
                                        <span><i className="fa fa-download me-1" /> {doc.downloadsCount}</span>
                                    </div>
                                </div>
                                <div className="doc-actions">
                                    <Link to={`/document/${doc.id}`} className="btn-pill ghost">
                                        Đọc ngay
                                    </Link>
                                    <button
                                        type="button"
                                        className={`btn-pill ${isFavorite ? "primary" : "ghost"} ms-2`}
                                        onClick={() => handleToggleFavorite(doc)}
                                        disabled={isLoadingFavorite}
                                    >
                                        <i className={`fa ${isFavorite ? "fa-heart" : "fa-heart-o"} me-1`} />
                                        {isFavorite ? "Đã lưu" : "Lưu"}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default CarouselComp;