import { useEffect, useState } from "react";
import { getAllDocumentByUser } from "../../../../apis/DocumentApi";
import {
    addFavoriteDocument,
    removeDocumentFavorite,
} from "../../../../apis/FavoriteApi";
import type { DocumentFavoriteResponse } from "../../../../models/response/DocumentFavoriteResponse";
import GrindItem from "../../components/GrindItem";
import { handleApiError } from "../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../constants/messages";

interface RightSidebarProps {
    userId: number;
    currentDocumentId: number;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ userId, currentDocumentId }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [documents, setDocuments] = useState<DocumentFavoriteResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);

    // Fetch documents
    useEffect(() => {
        if (!userId) return;

        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getAllDocumentByUser(currentDocumentId, userId);
                const list = response.resultList ?? [];
                // console.log("Fetched documents for user:", list);
                setDocuments(list.slice(0, 4));
            } catch (err: any) {
                const message = handleApiError(
                    err,
                    ERROR_MESSAGES.AUTHOR_DOCUMENTS_LOAD_FAILED
                );
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [userId, currentDocumentId]);

    // Toggle favorite
    const handleToggleFavorite = async (doc: DocumentFavoriteResponse) => {
        if (!isAuthenticated) {
            alert(ERROR_MESSAGES.LOGIN_REQUIRED_FAVORITE);
            return;
        }

        setFavoriteLoadingId(doc.id);

        try {
            if (doc.favorite === true) {
                await removeDocumentFavorite(doc.id);
                setDocuments((prev) =>
                    prev.map((item) =>
                        item.id === doc.id
                            ? { ...item, favorite: false }
                            : item
                    )
                );
            } else {
                await addFavoriteDocument({
                    contentId: doc.id,
                    type: "DOCUMENT",
                });

                setDocuments((prev) =>
                    prev.map((item) =>
                        item.id === doc.id
                            ? { ...item, favorite: true }
                            : item
                    )
                );
            }
        } catch (err: any) {
            const message = handleApiError(
                err,
                ERROR_MESSAGES.FAVORITE_UPDATE_FAILED
            );
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
                <div className="empty-state">
                    Tác giả chưa có thêm Tài liệu công khai.
                </div>
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
                        subtitle={
                            <p>by: {doc.username ?? "Tác giả ẩn danh"}</p>
                        }
                        viewsCount={doc.viewsCount}
                        downloadsCount={doc.downloadsCount}
                        variant="compact"
                        simple
                        numberFormatter={formatNumber}
                        showInlineFavorite
                        isFavorite={doc.favorite}
                        favoriteDisabled={favoriteLoadingId === doc.id}
                        onToggleFavorite={() => handleToggleFavorite(doc)}
                    />
                ))}
            </div>
        </section>
    );
};

export default RightSidebar;
