import { Link } from "react-router-dom";
import type { FavoriteDocumentResponse } from "../../../../models/response/FavoriteDocumentResponse";

interface DocumentFavoritesProps {
    documentFavorites: FavoriteDocumentResponse[];
    formatSavedDate: (value: string) => string;
    removingId: number | null;
    onRemove: (favoriteId: number) => void;
}

const DocumentFavoritesComp: React.FC<DocumentFavoritesProps> = ({
    documentFavorites,
    formatSavedDate,
    removingId,
    onRemove,
}) => {
    return (
        <section className="documents-block compact">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Danh sách tài liệu đã lưu</p>
                    <h3>Bộ sưu tập tài liệu</h3>
                </div>
                <span className="chip ghost">{documentFavorites.length}</span>
            </div>

            <div className="document-grid three-col favorites-grid">
                {documentFavorites.map((fav) => (
                    <article key={fav.id} className="document-card compact simple">
                        <Link to={`/document/${fav.documentId}`} className="doc-thumbnail">
                            {fav.documentThumbnailUrl ? (
                                <img
                                    src={`http://localhost:8080/api/images/thumbnail/${fav.documentThumbnailUrl}`}
                                    alt={fav.documentTitle}
                                />
                            ) : (
                                <div className="thumb-placeholder">Không có ảnh</div>
                            )}
                            <span className="doc-type">Kho lưu</span>
                        </Link>
                        <div className="doc-meta d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-column fw-semibold text-dark">
                                <div>
                                    <i className="fa fa-user me-1 text-secondary" /> by: {fav.authorName}
                                </div>
                                <div>
                                    <i className="fa fa-clock-o me-1 text-secondary" /> {formatSavedDate(fav.createdAt)}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="favorite-remove-btn"
                                onClick={() => onRemove(fav.id)}
                                disabled={removingId === fav.id}
                                aria-label="Xóa khỏi kho lưu"
                            >
                                <i className="fa fa-trash" />
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default DocumentFavoritesComp;
