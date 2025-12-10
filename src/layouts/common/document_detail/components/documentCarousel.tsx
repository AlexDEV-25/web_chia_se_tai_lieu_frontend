import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDocumentByCategory } from "../../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";

interface DocumentCarouselProps {
    categoryId: number;
    currentDocumentId: number;
}

const DocumentCarousel: React.FC<DocumentCarouselProps> = ({ categoryId, currentDocumentId }) => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllDocumentByCategory(categoryId);
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

        if (categoryId) {
            fetchByCategory();
        }
    }, [categoryId, currentDocumentId]);

    if (!categoryId) return null;

    return (
        <div className="border rounded p-4 shadow-sm bg-white mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Tài liệu cùng danh mục</h4>
                <span className="text-muted small">
                    {documents.length} tài liệu
                </span>
            </div>

            {loading && <div className="text-muted">Đang tải...</div>}
            {error && <div className="text-danger">{error}</div>}

            {!loading && !error && documents.length === 0 && (
                <p className="text-muted mb-0">Chưa có tài liệu phù hợp.</p>
            )}

            {!loading && !error && documents.length > 0 && (
                <div
                    className="d-flex gap-3 overflow-auto"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {documents.map((doc) => (
                        <Link
                            key={doc.id}
                            to={`/document/${doc.id}`}
                            className="card shadow-sm text-decoration-none"
                            style={{
                                minWidth: 220,
                                scrollSnapAlign: "start",
                            }}
                        >
                            <div className="card-body">
                                <h6 className="card-title text-truncate">{doc.title}</h6>
                                <p className="card-text text-muted small">
                                    {doc.description || "Không có mô tả."}
                                </p>
                                <span className="badge bg-light text-dark">
                                    {doc.categoryName ?? "Danh mục"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentCarousel;