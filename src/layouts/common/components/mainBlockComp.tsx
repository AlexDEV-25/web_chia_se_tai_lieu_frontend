import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FavoriteResponse } from "../../../models/response/FavoriteResponse";
import type { UserResponse } from "../../../models/response/UserResponse";
import { addFavorite, getFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import api from "../../../apis/HttpClient";

interface BaseItem {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    viewsCount: number;
    userName?: string;
}

interface DocumentItem extends BaseItem {
    downloadsCount?: number;
}

interface LessonItem extends BaseItem {
    documentUrl?: string;
}

type MainBlockCompProps = {
    loading: boolean;
    error: string | null;
    items: (DocumentItem | LessonItem)[];
    shimmerPlaceholders: unknown[];
    selectedCategoryLabel: string;
    itemType: "document" | "lesson";
    sectionTitle?: string;
    emptyMessage?: string;
    emptyIcon?: string;
};

type FavoriteMap = Record<number, { favoriteId: number }>;

const MainBlockComp: React.FC<MainBlockCompProps> = ({
    loading,
    error,
    items,
    shimmerPlaceholders,
    selectedCategoryLabel,
    itemType,
    sectionTitle,
    emptyMessage,
    emptyIcon,
}: MainBlockCompProps) => {
    const hasItems = items.length > 0;
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setCurrentUserId(null);
            setFavoriteMap({});
            return;
        }

        const fetchUserAndFavorites = async () => {
            try {
                const userResponse = await api.get("/users/my-info");
                const user = userResponse.data.result as UserResponse;
                setCurrentUserId(user.id);

                const favoritesResponse = await getFavoritesByUser();
                const favorites = favoritesResponse.resultList ?? [];
                const map: FavoriteMap = {};
                favorites.forEach((fav: FavoriteResponse) => {
                    if (fav.documentId) {
                        map[fav.documentId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err) {
                console.error("Không thể tải dữ liệu người dùng hoặc yêu thích", err);
                setFavoriteMap({});
            }
        };

        fetchUserAndFavorites();
    }, [token]);

    const handleToggleFavorite = async (itemId: number) => {
        if (!currentUserId) {
            alert("Vui lòng đăng nhập để lưu mục yêu thích.");
            return;
        }

        const existing = favoriteMap[itemId];
        setFavoriteLoadingId(itemId);

        try {
            if (existing) {
                await removeFavorite(existing.favoriteId);
                setFavoriteMap((prev) => {
                    const { [itemId]: _removed, ...rest } = prev;
                    return rest;
                });
            } else {
                const response = await addFavorite({
                    userId: currentUserId,
                    documentId: itemId,
                });
                const saved = response.result;
                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [itemId]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật yêu thích", err);
            alert("Không thể cập nhật yêu thích. Vui lòng thử lại.");
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const formatNumber = (value?: number | null) => {
        if (value == null) return "0";
        return value.toLocaleString("vi-VN");
    };

    const formatDuration = () => {
        return Math.floor(Math.random() * 60) + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0");
    };

    const getItemLink = (item: DocumentItem | LessonItem) => {
        return itemType === "document" ? `/document/${item.id}` : `/lesson/${item.id}`;
    };

    const renderThumbnail = (item: DocumentItem | LessonItem) => {
        const imageUrl = item.thumbnailUrl
            ? `http://localhost:8080/api/images/thumbnail/${item.thumbnailUrl}`
            : '/images/video-placeholder.jpg';

        if (itemType === "lesson") {
            return (
                <Link to={getItemLink(item)} className="doc-thumbnail">
                    <img src={imageUrl} alt={item.title} />
                    <div className="video-overlay">
                        <i className="fa fa-play-circle" />
                        <span className="duration">{formatDuration()}</span>
                    </div>
                    <span className="doc-type">Video</span>
                    {token && (
                        <button
                            className="favorite-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleFavorite(item.id);
                            }}
                            disabled={favoriteLoadingId === item.id}
                            aria-label={
                                favoriteMap[item.id] ? "Bỏ yêu thích" : "Thêm vào yêu thích"
                            }
                        >
                            <i
                                className={`fa${favoriteMap[item.id] ? "s" : "r"
                                    } fa-heart`}
                            />
                        </button>
                    )}
                </Link>
            );
        }

        return (
            <div className="doc-thumbnail">
                <img src={imageUrl} alt={item.title} />
                <span className="doc-type">{itemType === "document" ? "PDF" : "Video"}</span>
            </div>
        );
    };

    const renderMeta = (item: DocumentItem | LessonItem) => {
        const views = (
            <span>
                <i className="fa fa-eye me-1" /> {formatNumber(item.viewsCount)}
            </span>
        );

        if (itemType === "document" && "downloadsCount" in item) {
            const isFavorite = Boolean(favoriteMap[item.id]);
            const isLoadingFavorite = favoriteLoadingId === item.id;

            return (
                <div className="doc-meta">
                    <div className="meta-left">
                        {views}
                        <span>
                            <i className="fa fa-download me-1" /> {formatNumber(item.downloadsCount || 0)}
                        </span>
                    </div>
                    <button
                        type="button"
                        className={`favorite-inline ${isFavorite ? "active" : ""}`}
                        aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                        onClick={() => handleToggleFavorite(item.id)}
                        disabled={isLoadingFavorite}
                    >
                        <i className={`fa ${isFavorite ? "fa-heart" : "fa-heart-o"}`} />
                    </button>
                </div>
            );
        }

        return (
            <div className="doc-meta">
                <div className="meta-left">
                    {views}
                </div>
                {token && (
                    <button
                        type="button"
                        className={`favorite-inline ${favoriteMap[item.id] ? "active" : ""}`}
                        aria-label={favoriteMap[item.id] ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                        onClick={() => handleToggleFavorite(item.id)}
                        disabled={favoriteLoadingId === item.id}
                    >
                        <i className={`fa ${favoriteMap[item.id] ? "fa-heart" : "fa-heart-o"}`} />
                    </button>
                )}
            </div>
        );
    };

    const renderActions = () => null;

    return (
        <section className="documents-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">{sectionTitle || (itemType === "document" ? "Tài liệu đề xuất" : "Video đề xuất")}</p>
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
            ) : !hasItems ? (
                <div className="empty-state">
                    {emptyIcon && <i className={`fa ${emptyIcon}`} />}
                    <h3>Chưa có {itemType === "document" ? "tài liệu" : "video bài giảng"}</h3>
                    <p>{emptyMessage || `Không có ${itemType === "document" ? "tài liệu" : "video"} nào trong danh mục này. Hãy thử danh mục khác.`}</p>
                </div>
            ) : (
                <div className="document-grid">
                    {items.map((item) => (
                        <article key={item.id} className="document-card">
                            {renderThumbnail(item)}
                            <div className="doc-body">
                                <Link to={getItemLink(item)}>
                                    <h3>{item.title}</h3>
                                </Link>
                                <div>
                                    <i>{item.description ? item.description : "Không có mô tả."}</i>
                                    <div><strong style={{ fontWeight: 500, opacity: 0.7 }}>by:</strong> {item.userName}</div>
                                </div>
                                {renderMeta(item)}
                            </div>
                            {renderActions()}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MainBlockComp;