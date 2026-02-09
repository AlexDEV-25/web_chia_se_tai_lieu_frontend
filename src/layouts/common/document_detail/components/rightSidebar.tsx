import { useEffect, useState } from "react";

import { getAllDocumentByUser } from "../../../../apis/DocumentApi";
import {
    addFavoriteDocument,
    getDocumentFavoritesByUser,
    removeFavorite,
} from "../../../../apis/FavoriteApi";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";
import GrindItem from "../../components/GrindItem";
import { handleApiError } from "../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../constants/messages";

interface RightSidebarProps {
    userId: number;
    currentDocumentId: number;
}

type FavoriteMap = Record<number, { favoriteId: number }>;

const RightSidebar: React.FC<RightSidebarProps> = ({ userId, currentDocumentId }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchByUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllDocumentByUser(currentDocumentId, userId);
                const list = (response.resultList ?? []);
                setDocuments(list.slice(0, 6));
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.AUTHOR_DOCUMENTS_LOAD_FAILED);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchByUser();
        }
    }, [userId, currentDocumentId]);

    useEffect(() => {
        if (!isAuthenticated) {
            setFavoriteMap({});
            return;
        }

        const fetchFavorites = async () => {
            try {
                const favoritesResponse = await getDocumentFavoritesByUser();
                const map: FavoriteMap = {};
                (favoritesResponse.resultList ?? []).forEach((fav: any) => {
                    if (fav.contentId) {
                        map[fav.contentId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.FAVORITES_LOAD_FAILED);
                console.error(message)
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [isAuthenticated]);

    const handleToggleFavorite = async (doc: DocumentResponse) => {
        if (!isAuthenticated) {
            alert(ERROR_MESSAGES.LOGIN_REQUIRED_FAVORITE);
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
                    contentId: doc.id,
                    type: 'DOCUMENT',
                });
                const saved = response.result;
                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [doc.id]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED);
            alert(message);
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
                    <h3>Tài liệu nổi bật</h3>
                </div>
                <span className="chip ghost">{documents.length}</span>
            </div>

            {loading && <div className="empty-state">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && documents.length === 0 && (
                <div className="empty-state">Tác giả chưa có thêm Tài liệu công khai.</div>
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