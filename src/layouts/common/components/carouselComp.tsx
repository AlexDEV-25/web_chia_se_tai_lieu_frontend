import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDocumentByCategory } from "../../../apis/DocumentApi";

import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { FavoriteDocumentResponse } from "../../../models/response/FavoriteDocumentResponse";
import { addFavoriteDocument, getDocumentFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import { getMyInfo } from "../../../apis/UserApi";
import GrindItem from "./GrindItem";

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
                const fetchedUserId = user?.result?.id ?? null;
                setCurrentUserId(fetchedUserId);
                if (!fetchedUserId) {
                    setFavoriteMap({});
                    return;
                }

                const favoritesResponse = await getDocumentFavoritesByUser();
                const map: FavoriteMap = {};
                (favoritesResponse.resultList ?? []).forEach((fav: FavoriteDocumentResponse) => {
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
                const response = await addFavoriteDocument({
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
                        const thumbnailUrl = doc.thumbnailUrl
                            ? `http://localhost:8080/api/images/thumbnail/${doc.thumbnailUrl}`
                            : undefined;

                        return (
                            <GrindItem
                                key={doc.id}
                                itemType="document"
                                link={`/document/${doc.id}`}
                                title={doc.title}
                                thumbnailUrl={thumbnailUrl}
                                subtitle={<p>{doc.description ?? "Tài liệu chưa có mô tả."}</p>}
                                viewsCount={doc.viewsCount}
                                downloadsCount={doc.downloadsCount}
                                showInlineFavorite
                                isFavorite={isFavorite}
                                favoriteDisabled={isLoadingFavorite}
                                onToggleFavorite={() => handleToggleFavorite(doc)}
                                showOverlayFavorite={Boolean(token)}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default CarouselComp;