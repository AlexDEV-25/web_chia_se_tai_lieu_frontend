import { useEffect, useState } from "react";

import { getAllDocumentByUser } from "../../../../apis/DocumentApi";
import {
    addFavoriteDocument,
    getDocumentFavoritesByUser,
    removeFavorite,
} from "../../../../apis/FavoriteApi";
import { getMyInfo } from "../../../../apis/UserApi";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";
import type { FavoriteDocumentResponse } from "../../../../models/response/FavoriteDocumentResponse";
import GrindItem from "../../components/GrindItem";

interface RightSidebarProps {
    userId: number;
    currentDocumentId: number;
}

type FavoriteMap = Record<number, { favoriteId: number }>;

const RightSidebar: React.FC<RightSidebarProps> = ({ userId, currentDocumentId }) => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchByUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllDocumentByUser(userId);
                const list = (response.resultList ?? []).filter(
                    (doc) => doc.id !== currentDocumentId && doc.status === "PUBLISHED"
                );
                setDocuments(list.slice(0, 6));
            } catch (err) {
                console.error("RightSidebar error", err);
                setError("Không thể tải thêm slide của tác giả này.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchByUser();
        }
    }, [userId, currentDocumentId]);

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
                console.error("Không thể tải kho lưu tài liệu", err);
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
            console.error("Lỗi khi cập nhật kho lưu", err);
            alert("Không thể cập nhật kho lưu. Vui lòng thử lại.");
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const formatNumber = (value?: number | null) => {
        if (!value) return "0";
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
    };

    if (!userId) return null;

    return (
        <section className="documents-block compact">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Từ tác giả này</p>
                    <h3>Slide nổi bật</h3>
                </div>
                <span className="chip ghost">{documents.length}</span>
            </div>

            {loading && <div className="empty-state">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && documents.length === 0 && (
                <div className="empty-state">Tác giả chưa có thêm slide công khai.</div>
            )}

            <div className="document-grid two-col">
                {documents.map((doc) => (
                    <GrindItem
                        key={doc.id}
                        itemType="document"
                        link={`/document/${doc.id}`}
                        title={doc.title}
                        thumbnailUrl={
                            doc.thumbnailUrl
                                ? `http://localhost:8080/api/images/thumbnail/${doc.thumbnailUrl}`
                                : undefined
                        }
                        subtitle={<p>by: {doc.userName ?? "Tác giả ẩn danh"}</p>}
                        viewsCount={doc.viewsCount}
                        downloadsCount={doc.downloadsCount}
                        variant="compact"
                        simple
                        numberFormatter={formatNumber}
                        showInlineFavorite
                        isFavorite={Boolean(favoriteMap[doc.id])}
                        favoriteDisabled={favoriteLoadingId === doc.id}
                        onToggleFavorite={() => handleToggleFavorite(doc)}
                    />
                ))}
            </div>
        </section>
    );
};

export default RightSidebar;