import { Link } from "react-router-dom";
import type { FavoriteResponse } from "../../../../models/response/FavoriteResponse";

type FavoriteType = "DOCUMENT" | "LESSON";

interface FavoritesCompProps {
    type: FavoriteType;
    favorites: FavoriteResponse[];
    formatSavedDate: (value: string) => string;
    removingId: number | null;
    onRemove: (favoriteId: number) => void;
}

const FavoritesComp: React.FC<FavoritesCompProps> = ({
    type,
    favorites,
    formatSavedDate,
    removingId,
    onRemove,
}) => {
    const isDocument = type === "DOCUMENT";

    return (
        <section className="documents-block compact">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">
                        {isDocument
                            ? "Danh sách tài liệu đã lưu"
                            : "Danh sách bài giảng đã lưu"}
                    </p>
                    <h3>{isDocument ? "Bộ sưu tập tài liệu" : "Video yêu thích"}</h3>
                </div>
                <span className="chip ghost">{favorites.length}</span>
            </div>

            <div className="document-grid three-col favorites-grid">
                {favorites.map((fav) => {
                    const link = isDocument ? `/document/${fav.contentId}` : `/lesson/${fav.contentId}`;
                    const thumbnail = fav.thumbnailUrl;
                    const title = fav.title;
                    return (
                        <article key={fav.id} className="document-card compact simple">
                            <Link to={link} className="doc-thumbnail">
                                {thumbnail ? (
                                    <img
                                        src={`http://localhost:8080/api/images/thumbnail/${thumbnail}`}
                                        alt={title}
                                    />
                                ) : (
                                    <div className="thumb-placeholder">
                                        Không có ảnh
                                    </div>
                                )}
                                <span className="doc-type">
                                    {isDocument ? "Kho lưu" : "Video"}
                                </span>
                            </Link>

                            <div className="doc-meta d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column fw-semibold text-dark">
                                    <div>
                                        <i className="fa fa-user me-1 text-secondary" />
                                        by: {fav.authorName}
                                    </div>
                                    <div>
                                        <i className="fa fa-clock-o me-1 text-secondary" />
                                        {formatSavedDate(fav.createdAt)}
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
                    );
                })}
            </div>
        </section>
    );
};

export default FavoritesComp;
