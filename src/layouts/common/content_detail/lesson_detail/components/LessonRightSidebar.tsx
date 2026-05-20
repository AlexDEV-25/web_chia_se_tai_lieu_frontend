import { useEffect, useState } from "react";
import type { LessonResponse } from "../../../../../models/response/lesson/LessonResponse";
import { getAllLessonByUser } from "../../../../../apis/LessonApi";
import { handleApiError } from "../../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../../constants/messages";
import { addFavorite, removeLessonFavorite } from "../../../../../apis/FavoriteApi";
import GrindItem from "../../../components/GrindItem";
import AlertDialog from "../../../components/AlertDialog";



interface LessonRightSidebarProps {
    userId: number;
    currentLessonId: number;
}

const LessonRightSidebar: React.FC<LessonRightSidebarProps> = ({
    userId,
    currentLessonId,
}) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '' });

    const handleCloseAlert = () => setAlertDialog({ isOpen: false, title: '', message: '' });

    // Fetch lessons
    useEffect(() => {
        if (!userId) return;

        const fetchLessons = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getAllLessonByUser(
                    currentLessonId,
                    userId
                );
                const list = response.resultList ?? [];
                setLessons(list.slice(0, 4));
            } catch (err: any) {
                const message = handleApiError(
                    err,
                    ERROR_MESSAGES.LESSON_AUTHOR_LOAD_FAILED
                );
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [userId, currentLessonId]);

    // Toggle favorite
    const handleToggleFavorite = async (lesson: LessonResponse) => {
        if (!isAuthenticated) {
            setAlertDialog({
                isOpen: true,
                title: 'Yêu cầu đăng nhập',
                message: ERROR_MESSAGES.LOGIN_REQUIRED_LESSON_FAVORITE
            });
            return;
        }

        setFavoriteLoadingId(lesson.id);

        try {
            if (lesson.favorite) {
                await removeLessonFavorite(lesson.id);
                setLessons((prev) =>
                    prev.map((item) =>
                        item.id === lesson.id
                            ? { ...item, isFavorite: false }
                            : item
                    )
                );
            } else {
                await addFavorite({
                    contentId: lesson.id,
                    type: "LESSON",
                });

                setLessons((prev) =>
                    prev.map((item) =>
                        item.id === lesson.id
                            ? { ...item, isFavorite: true }
                            : item
                    )
                );
            }
        } catch (err: any) {
            const message = handleApiError(
                err,
                ERROR_MESSAGES.FAVORITE_UPDATE_FAILED
            );
            setAlertDialog({
                isOpen: true,
                title: 'Lỗi cập nhật',
                message: message
            });
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
                <div className="empty-state">
                    Giảng viên chưa có thêm video công khai.
                </div>
            )}

            <div className="document-grid two-col">
                {lessons.map((lesson) => (
                    <GrindItem
                        key={lesson.id}
                        itemType="LESSON"
                        link={`/lesson/${lesson.id}`}
                        title={lesson.title}
                        thumbnailUrl={
                            lesson.thumbnailUrl
                                ? `${lesson.thumbnailUrl}`
                                : undefined
                        }
                        subtitle={
                            <p>
                                by: {lesson.username ?? "Giảng viên ẩn danh"}
                            </p>
                        }
                        viewsCount={lesson.viewsCount}
                        variant="compact"
                        simple
                        showVideoOverlay
                        showInlineFavorite
                        isFavorite={lesson.favorite}
                        favoriteDisabled={favoriteLoadingId === lesson.id}
                        onToggleFavorite={() =>
                            handleToggleFavorite(lesson)
                        }
                        metaExtras={
                            lesson.thumbnailUrl ? (
                                <span>
                                    <i className="fa fa-file-pdf-o me-1" /> Tài
                                    liệu
                                </span>
                            ) : undefined
                        }
                        numberFormatter={formatNumber}
                    />
                ))}
            </div>
            <AlertDialog
                isOpen={alertDialog.isOpen}
                title={alertDialog.title}
                message={alertDialog.message}
                onClose={handleCloseAlert}
            />
        </section>
    );
};

export default LessonRightSidebar;
