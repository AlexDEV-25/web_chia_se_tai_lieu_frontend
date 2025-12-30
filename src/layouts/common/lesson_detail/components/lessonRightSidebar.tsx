import { useEffect, useState } from "react";

import { getAllLessonByUser } from "../../../../apis/LessonApi";
import {
    addFavoriteLesson,
    getLessonFavoritesByUser,
    removeFavorite,
} from "../../../../apis/FavoriteApi";
import { getMyInfo } from "../../../../apis/UserApi";
import type { LessonResponse } from "../../../../models/response/LessonResponse";
import type { FavoriteLessonResponse } from "../../../../models/response/FavoriteLessonResponse";
import GrindItem from "../../components/GrindItem";

interface LessonRightSidebarProps {
    userId: number;
    currentLessonId: number;
}

type FavoriteMap = Record<number, { favoriteId: number }>;

const LessonRightSidebar: React.FC<LessonRightSidebarProps> = ({ userId, currentLessonId }) => {
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

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
            } catch (err) {
                console.error("LessonRightSidebar error", err);
                setError("Không thể tải thêm video của giảng viên này.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchByUser();
        }
    }, [userId, currentLessonId]);

    useEffect(() => {
        if (!token) {
            setCurrentUserId(null);
            setFavoriteMap({});
            return;
        }

        const fetchFavorites = async () => {
            try {
                const user = await getMyInfo();
                const fetchedUserId = user?.result?.id ?? null;
                setCurrentUserId(fetchedUserId);

                if (!fetchedUserId) {
                    setFavoriteMap({});
                    return;
                }

                const favoritesResponse = await getLessonFavoritesByUser();
                const map: FavoriteMap = {};
                (favoritesResponse.resultList ?? []).forEach((fav: FavoriteLessonResponse) => {
                    if (fav.lessonId) {
                        map[fav.lessonId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err) {
                console.error("Không thể tải kho lưu video", err);
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [token]);

    const handleToggleFavorite = async (lesson: LessonResponse) => {
        if (!currentUserId) {
            alert("Vui lòng đăng nhập để lưu video yêu thích.");
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
                    lessonId: lesson.id,
                });
                const saved = response.result;
                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [lesson.id]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err) {
            console.error("Không thể cập nhật kho lưu video", err);
            alert("Không thể cập nhật kho lưu. Vui lòng thử lại.");
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
