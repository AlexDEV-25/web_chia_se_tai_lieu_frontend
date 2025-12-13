import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";
import type { FavoriteResponse } from "../../../../models/response/FavoriteResponse";
import type { UserResponse } from "../../../../models/response/UserResponse";
import { addFavorite, getFavoritesByUser, removeFavorite } from "../../../../apis/FavoriteApi";
import api from "../../../../apis/HttpClient";

type DocumentBlockProps = {
    loading: boolean;
    error: string | null;
    documents: DocumentResponse[];
    shimmerPlaceholders: unknown[];
    selectedCategoryLabel: string;
};

type FavoriteMap = Record<
    number,
    {
        favoriteId: number;
    }
>;

const DocumentBlock = ({
    loading,
    error,
    documents,
    shimmerPlaceholders,
    selectedCategoryLabel,
}: DocumentBlockProps) => {
    const hasDocuments = documents.length > 0;
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setCurrentUserId(null);
            setFavoriteMap({});
            return;
        }

        const fetchUserAndFavorites = async () => {
            try {
                const userResponse = await api.get("/users/my-info");
                const user = userResponse.data.result as UserResponse;
                setCurrentUserId(user.id);

                const favoritesResponse = await getFavoritesByUser();
                const list = favoritesResponse.resultList ?? [];
                const map: FavoriteMap = {};
                list.forEach((fav: FavoriteResponse) => {
                    if (fav.documentId) {
                        map[fav.documentId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err) {
                console.error("Không thể tải danh sách yêu thích", err);
                setFavoriteMap({});
            }
        };

        fetchUserAndFavorites();
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

    return (
        <section className="documents-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Tài liệu đề xuất</p>
                    <h2>{selectedCategoryLabel}</h2>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="document-grid">
                    {shimmerPlaceholders.map((_, index) => (
                        <div key={index} className="document-card shimmer" />
                    ))}
                </div>
            ) : !hasDocuments ? (
                <div className="empty-state">
                    <p>Không tìm thấy tài liệu phù hợp. Hãy thử từ khóa khác nhé!</p>
                </div>
            ) : (
                <div className="document-grid">
                    {documents.slice(0, 8).map((doc) => {
                        const isFavorite = Boolean(favoriteMap[doc.id]);
                        const isLoadingFavorite = favoriteLoadingId === doc.id;
                        return (
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

export default DocumentBlock;
