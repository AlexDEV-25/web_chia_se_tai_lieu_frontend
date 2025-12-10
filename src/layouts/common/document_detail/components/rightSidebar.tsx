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
                setDocuments(list.slice(0, 12));
            } catch (err) {
                console.error("DocumentCarousel error", err);
                setError("Không thể tải tài liệu cùng danh mục.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchByUser();
        }
    }, [userId, currentDocumentId]);

    if (!userId) return null;

    return (
        <div className="border rounded p-3 shadow-sm bg-white" style={{ maxHeight: "75vh", overflowY: "auto" }}>
            <h5 className="fw-bold mb-3">Gợi ý thêm</h5>

            {documents.length === 0 && (
                <p className="text-muted">Chưa có tài liệu liên quan.</p>
            )}

            {loading && <div className="text-muted">Đang tải...</div>}
            {error && <div className="text-danger">{error}</div>}

            <div className="list-group">
                {documents.map((item) => (
                    <Link
                        to={`/document/${item.id}`}
                        className="list-group-item list-group-item-action"
                        key={item.id}
                    >
                        <strong className="d-block">{item.title}</strong>
                        <small className="text-muted">{item.description}</small>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RightSidebar;