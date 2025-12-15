import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { LessonResponse } from "../../../../models/response/LessonResponse";
import type { FavoriteResponse } from "../../../../models/response/FavoriteResponse";
import type { UserResponse } from "../../../../models/response/UserResponse";
import { addFavorite, getFavoritesByUser, removeFavorite } from "../../../../apis/FavoriteApi";
import api from "../../../../apis/HttpClient";

type LessonBlockProps = {
    loading: boolean;
    error: string | null;
    lessons: LessonResponse[];
    shimmerPlaceholders: unknown[];
    selectedCategoryLabel: string;
};

type FavoriteMap = Record<number, { favoriteId: number }>;

const LessonBlock: React.FC<LessonBlockProps> = ({
    loading,
    error,
    lessons,
    shimmerPlaceholders,
    selectedCategoryLabel,
}: LessonBlockProps) => {
    const hasLessons = lessons.length > 0;
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
                console.error("Failed to fetch user/favorites:", err);
                setCurrentUserId(null);
                setFavoriteMap({});
            }
        };

        fetchUserAndFavorites();
    }, [token]);

    const handleToggleFavorite = async (lessonId: number) => {
        if (!currentUserId) return;

        setFavoriteLoadingId(lessonId);
        try {
            const existing = favoriteMap[lessonId];
            if (existing) {
                await removeFavorite(existing.favoriteId);
                setFavoriteMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[lessonId];
                    return newMap;
                });
            } else {
                const response = await addFavorite({ userId: currentUserId, documentId: lessonId });
                setFavoriteMap(prev => ({
                    ...prev,
                    [lessonId]: { favoriteId: response.result?.id ?? 0 }
                }));
            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    const formatDuration = () => {
        // Mock duration - in real app, this would come from API or video metadata
        return "15:30";
    };

    return (
        <section className="documents-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">{selectedCategoryLabel}</p>
                    <h2>Video bài giảng nổi bật</h2>
                </div>
            </div>

            {loading ? (
                <div className="document-grid">
                    {shimmerPlaceholders.map((_, index) => (
                        <div key={index} className="document-card shimmer" />
                    ))}
                </div>
            ) : error ? (
                <div className="error-message">
                    <i className="fa fa-exclamation-triangle" />
                    <p>{error}</p>
                </div>
            ) : !hasLessons ? (
                <div className="empty-state">
                    <i className="fa fa-video" />
                    <h3>Chưa có video bài giảng</h3>
                    <p>Không có video nào trong danh mục này. Hãy thử danh mục khác.</p>
                </div>
            ) : (
                <div className="document-grid">
                    {lessons.map((lesson) => (
                        <article className="document-card" key={lesson.id}>
                            <Link to={`/lesson/${lesson.id}`} className="doc-thumbnail">
                                <img
                                    src={`${`http://localhost:8080/api/images/thumbnail/${lesson.thumbnailUrl}` || '/images/video-placeholder.jpg'}`}
                                    alt={lesson.title}
                                />
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
                                            handleToggleFavorite(lesson.id);
                                        }}
                                        disabled={favoriteLoadingId === lesson.id}
                                        aria-label={
                                            favoriteMap[lesson.id] ? "Bỏ yêu thích" : "Thêm vào yêu thích"
                                        }
                                    >
                                        <i
                                            className={`fa${favoriteMap[lesson.id] ? "s" : "r"
                                                } fa-heart`}
                                        />
                                    </button>
                                )}
                            </Link>
                            <div className="doc-body">
                                <Link to={`/lesson/${lesson.id}`}>
                                    <h3>{lesson.title}</h3>
                                </Link>
                                <p>by: {lesson.userName ?? "Giảng viên ẩn danh"}</p>
                                <div className="doc-meta">
                                    <span>
                                        <i className="fa fa-eye me-1" /> {formatNumber(lesson.viewsCount)}
                                    </span>
                                    <span>
                                        <i className="fa fa-download me-1" /> Tài liệu
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default LessonBlock;
