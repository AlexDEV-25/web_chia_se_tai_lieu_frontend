import { Link } from "react-router-dom";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";

type DocumentBlockProps = {
    loading: boolean;
    error: string | null;
    documents: DocumentResponse[];
    shimmerPlaceholders: unknown[];
    selectedCategoryLabel: string;
};

const DocumentBlock = ({
    loading,
    error,
    documents,
    shimmerPlaceholders,
    selectedCategoryLabel,
}: DocumentBlockProps) => {
    const hasDocuments = documents.length > 0;

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
                    {documents.slice(0, 8).map((doc) => (
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
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default DocumentBlock;
