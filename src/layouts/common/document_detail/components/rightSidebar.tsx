import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDocumentByUser } from "../../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";

interface RightSidebarProps {
    userId: number;
    currentDocumentId: number;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ userId, currentDocumentId }) => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const formatNumber = (value?: number) => {
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
                    <article key={doc.id} className="document-card compact simple">
                        <Link to={`/document/${doc.id}`} className="doc-thumbnail">
                            <img src={`http://localhost:8080/api/images/thumbnail/${doc.thumbnailUrl}`} alt={doc.title} />
                            <span className="doc-type">PDF</span>
                        </Link>
                        <div className="doc-body">
                            <Link to={`/document/${doc.id}`}>
                                <h3>{doc.title}</h3>
                            </Link>
                            <p>by: {doc.userName ?? "Tác giả ẩn danh"}</p>
                            <div className="doc-meta">
                                <span><i className="fa fa-eye me-1" /> {formatNumber(doc.viewsCount)}</span>
                                <span><i className="fa fa-download me-1" /> {formatNumber(doc.downloadsCount)}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default RightSidebar;