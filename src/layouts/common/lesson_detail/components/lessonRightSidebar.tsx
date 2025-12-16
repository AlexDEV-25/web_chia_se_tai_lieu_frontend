import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllLessonByUser } from "../../../../apis/LessonApi";
import type { LessonResponse } from "../../../../models/response/LessonResponse";

interface LessonRightSidebarProps {
    userId: number;
    currentLessonId: number;
}

const LessonRightSidebar: React.FC<LessonRightSidebarProps> = ({ userId, currentLessonId }) => {
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const formatNumber = (value?: number) => {
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
                    <article key={lesson.id} className="document-card compact simple">
                        <Link to={`/lesson/${lesson.id}`} className="doc-thumbnail">
                            <img
                                src={`http://localhost:8080/api/images/thumbnail/${lesson.thumbnailUrl}`}
                                alt={lesson.title}
                            />
                            <span className="doc-type">Video</span>
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
                                {lesson.documentUrl && (
                                    <span>
                                        <i className="fa fa-file-pdf-o me-1" /> Tài liệu
                                    </span>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default LessonRightSidebar;
