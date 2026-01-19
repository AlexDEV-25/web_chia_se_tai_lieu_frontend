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

    if (favorites.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <i className="fa fa-heart"></i>
                </div>
                <h3>Chưa có {isDocument ? "tài liệu" : "bài giảng"} nào</h3>
                <p>Bạn chưa lưu {isDocument ? "tài liệu" : "bài giảng"} nào. Hãy bắt đầu thêm {isDocument ? "tài liệu" : "bài giảng"} yêu thích của bạn!</p>
            </div>
        );
    }

    return (
        <>
            <div className="document-grid">
                {favorites.map((fav) => {
                    const link = isDocument ? `/document/${fav.contentId}` : `/lesson/${fav.contentId}`;
                    const thumbnail = fav.thumbnailUrl;
                    const title = fav.title;
                    return (
                        <div key={fav.id} className="document-card">
                            <div className="document-thumbnail">
                                <Link to={link}>
                                    {thumbnail ? (
                                        <img src={`http://localhost:8080/api/images/thumbnail/${thumbnail}`} alt={title} />
                                    ) : (
                                        <div className="default-thumbnail">
                                            <i className="fa fa-file-text"></i>
                                        </div>
                                    )}
                                </Link>
                                <div className="document-status">
                                    <span className="status-badge published">
                                        {isDocument ? "Tài liệu" : "Bài giảng"}
                                    </span>
                                </div>
                            </div>

                            <div className="document-info">
                                <h3 className="document-title">{title}</h3>
                                <p className="document-description">
                                    {isDocument ? 'Tài liệu đã lưu' : 'Bài giảng đã lưu'}
                                </p>

                                <div className="document-meta">
                                    <div className="meta-item">
                                        <i className="fa fa-user"></i>
                                        <span>{fav.authorName}</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className="fa fa-clock-o"></i>
                                        <span>{formatSavedDate(fav.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="document-action">
                                <button
                                    className="action-button delete"
                                    onClick={() => onRemove(fav.id)}
                                    disabled={removingId === fav.id}
                                    title="Xóa khỏi yêu thích"
                                >
                                    <i className="fa fa-trash"></i>
                                    {removingId === fav.id ? ' Đang xóa...' : ' Xóa'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FavoritesComp;
