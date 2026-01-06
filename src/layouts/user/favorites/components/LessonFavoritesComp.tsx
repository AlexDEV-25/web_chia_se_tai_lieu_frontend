import { Link } from "react-router-dom";
import type { FavoriteLessonResponse } from "../../../../models/response/FavoriteLessonResponse";

interface LessonFavoritesProps {
    lessonFavorites: FavoriteLessonResponse[];
    formatSavedDate: (value: string) => string;
    removingId: number | null;
    onRemove: (favoriteId: number) => void;
}

const LessonFavoritesComp: React.FC<LessonFavoritesProps> = ({
    lessonFavorites,
    formatSavedDate,
    removingId,
    onRemove,
}) => {
    return (
        <section className="documents-block compact">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Danh sách bài giảng đã lưu</p>
                    <h3>Video yêu thích</h3>
                </div>
                <span className="chip ghost">{lessonFavorites.length}</span>
            </div>

            <div className="document-grid three-col favorites-grid">
                {lessonFavorites.map((fav) => (
                    <article key={fav.id} className="document-card compact simple">
                        <Link to={`/lesson/${fav.lessonId}`} className="doc-thumbnail">
                            {fav.lessonThumbnailUrl ? (
                                <img
                                    src={`http://localhost:8080/api/images/thumbnail/${fav.lessonThumbnailUrl}`}
                                    alt={fav.lessonTitle}
                                />
                            ) : (
                                <div className="thumb-placeholder">Không có ảnh</div>
                            )}
                            <span className="doc-type">Video</span>
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

export default LessonFavoritesComp;
