import { useEffect, useState, useContext } from "react";

import { getAllLessonByUser } from "../../../../apis/LessonApi";
import {
    addFavoriteLesson,
    getLessonFavoritesByUser,
    removeFavorite,
} from "../../../../apis/FavoriteApi";
import { UserContext } from "../../../../AppContext";
import type { LessonResponse } from "../../../../models/response/LessonResponse";
import GrindItem from "../../components/GrindItem";
import { handleApiError } from "../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../constants/messages";

interface LessonRightSidebarProps {
    userId: number;
    currentLessonId: number;
}

type FavoriteMap = Record<number, { favoriteId: number }>;

const LessonRightSidebar: React.FC<LessonRightSidebarProps> = ({ userId, currentLessonId }) => {
    const userCtx = useContext(UserContext);
    const currentUser = userCtx?.currentUser;
    const currentUserId = currentUser?.id ?? null;

    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchByUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllLessonByUser(userId);
                const list = (response.resultList ?? []).filter(
                    (lesson) => lesson.id !== currentLessonId && lesson.status === "PUBLISHED" && !lesson.hide
                );
                setLessons(list.slice(0, 6));
            } catch (err: any) {
                setError(handleApiError(err, ERROR_MESSAGES.LESSON_AUTHOR_LOAD_FAILED));
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchByUser();
        }
    }, [userId, currentLessonId]);

    useEffect(() => {
        if (!currentUserId) {
            setFavoriteMap({});
            return;
        }

        const fetchFavorites = async () => {
            try {
                const favoritesResponse = await getLessonFavoritesByUser();
                const map: FavoriteMap = {};
                (favoritesResponse.resultList ?? []).forEach((fav: any) => {
                    if (fav.contentId) {
                        map[fav.contentId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.FAVORITES_LOAD_FAILED);
                console.error(message);
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [currentUserId]);

    const handleToggleFavorite = async (lesson: LessonResponse) => {
        if (!currentUserId) {
            alert(ERROR_MESSAGES.LOGIN_REQUIRED_LESSON_FAVORITE);
            return;
        }

        const existing = favoriteMap[lesson.id];
        setFavoriteLoadingId(lesson.id);

        try {
            if (existing) {
                await removeFavorite(existing.favoriteId);
                setFavoriteMap((prev) => {
                    const { [lesson.id]: _removed, ...rest } = prev;
                    return rest;
                });
            } else {
                const response = await addFavoriteLesson({
                    userId: currentUserId,
                    contentId: lesson.id,
                    type: 'LESSON',
                });
                const saved = response.result;
                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [lesson.id]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED);
            alert(message);
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const formatNumber = (value?: number | null) => {
        if (!value) return "0";
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
    };

    if (!userId) return null;

    return (
        <section className="documents-block compact">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Giảng viên này</p>
                    <h3>Video nổi bật</h3>
                </div>
                <span className="chip ghost">{lessons.length}</span>
            </div>

            {loading && <div className="empty-state">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && lessons.length === 0 && (
                <div className="empty-state">Giảng viên chưa có thêm video công khai.</div>
            )}

            <div className="document-grid two-col">
                {lessons.map((lesson) => (
                    <GrindItem
                        key={lesson.id}
                        itemType="lesson"
                        link={`/lesson/${lesson.id}`}
                        title={lesson.title}
                        thumbnailUrl={
                            lesson.thumbnailUrl
                                ? `http://localhost:8080/api/images/thumbnail/${lesson.thumbnailUrl}`
                                : undefined
                        }
                        subtitle={<p>by: {lesson.userName ?? "Giảng viên ẩn danh"}</p>}
                        viewsCount={lesson.viewsCount}
                        variant="compact"
                        simple
                        showVideoOverlay
                        showInlineFavorite
                        isFavorite={Boolean(favoriteMap[lesson.id])}
                        favoriteDisabled={favoriteLoadingId === lesson.id}
                        onToggleFavorite={() => handleToggleFavorite(lesson)}
                        metaExtras={
                            lesson.documentUrl ? (
                                <span>
                                    <i className="fa fa-file-pdf-o me-1" /> Tài liệu
                                </span>
                            ) : undefined
                        }
                        numberFormatter={formatNumber}
                    />
                ))}
            </div>
        </section>
    );
};

export default LessonRightSidebar;
