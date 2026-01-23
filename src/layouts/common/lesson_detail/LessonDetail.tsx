import { useEffect, useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import VideoComp from "./components/VideoComp";
import DocumentComp from "./components/DocumentComp";
import { downloadDocument, downloadSubFile, getLessonById, increaseView } from "../../../apis/LessonApi";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import LessonRightSidebar from "./components/LessonRightSidebar";
import CarouselComp from "../components/CarouselComp";
import RatingComp from "../components/RatingComp";
import CommentComp from "../components/CommentComp";
import { UserContext } from "../../../AppContext";
import { addFavoriteLesson, getLessonFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";

const LessonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const lessonId = Number(id);

    const userCtx = useContext(UserContext);
    const currentUser = userCtx?.currentUser;
    const currentUserId = currentUser?.id ?? null;

    const [lessonDetail, setLessonDetail] = useState<LessonResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingDoc, setDownloadingDoc] = useState(false);
    const [downloadingSub, setDownloadingSub] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        if (!lessonId) {
            setError(ERROR_MESSAGES.LESSON_NOT_FOUND);
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                const response = await getLessonById(lessonId);
                setLessonDetail(response?.result ?? null);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.LESSON_DETAIL_LOAD_FAILED);
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [lessonId]);

    useEffect(() => {
        if (!lessonId) return;

        const timer = setTimeout(async () => {
            try {
                await increaseView(lessonId);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.INCREASE_VIEW_FAILED);
                console.error(message);
            }
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, [lessonId]);

    useEffect(() => {
        if (!lessonId || !currentUserId) {
            setFavoriteId(null);
            return;
        }

        let isMounted = true;

        const fetchFavoriteState = async () => {
            try {
                const favoritesResponse = await getLessonFavoritesByUser();
                if (!isMounted) return;
                const favorites = favoritesResponse.resultList ?? [];
                const existing = favorites.find((fav) => fav.contentId === lessonId);
                setFavoriteId(existing ? existing.id : null);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_ADD_FAILED);
                console.error(message);
                if (isMounted) {
                    setFavoriteId(null);
                }
            }
        };

        fetchFavoriteState();

        return () => {
            isMounted = false;
        };
    }, [lessonId, currentUserId]);

    const handleToggleFavorite = async () => {
        if (!lessonId) return;
        if (!currentUserId) {
            alert(ERROR_MESSAGES.LOGIN_REQUIRED_LESSON_FAVORITE);
            return;
        }

        setFavoriteLoading(true);

        try {
            if (favoriteId) {
                await removeFavorite(favoriteId);
                setFavoriteId(null);
            } else {
                const response = await addFavoriteLesson({
                    userId: currentUserId,
                    contentId: lessonId,
                    type: 'LESSON',
                });

                const saved = response.result;
                if (saved) {
                    setFavoriteId(saved.id);
                }
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_ADD_FAILED);
            console.error(message);
            alert(message);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const meta = useMemo(() => {
        if (!lessonDetail) return [];
        return [
            { label: "Danh mục", value: lessonDetail.categoryName ?? "Chưa rõ" },
            { label: "Lượt xem", value: lessonDetail.viewsCount?.toLocaleString("vi-VN") ?? "0" },
            {
                label: "Cập nhật",
                value: lessonDetail.updatedAt
                    ? new Date(lessonDetail.updatedAt).toLocaleDateString("vi-VN")
                    : "Chưa rõ",
            },
        ];
    }, [lessonDetail]);

    const handleDownloadDocument = async () => {
        if (!lessonDetail?.id) return;
        setDownloadingDoc(true);
        try {
            const blob = await downloadDocument(lessonDetail.id);
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = lessonDetail.title ? `${lessonDetail.title}.pdf` : "document.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOWNLOAD_LOGIN_REQUIRED_LESSON);
            alert(message);
        } finally {
            setDownloadingDoc(false);
        }
    };
    const handleDownloadSubFile = async () => {
        if (!lessonDetail?.id) return;
        setDownloadingSub(true);
        try {
            const blob = await downloadSubFile(lessonDetail.id);
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = lessonDetail.title ? `${lessonDetail.title}.rar` : "subfile.rar";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOWNLOAD_SUBFILE_LOGIN_REQUIRED);
            alert(message);
        } finally {
            setDownloadingSub(false);
        }
    };

    if (loading) {
        return <div className="lesson-detail-shell"><div className="glass-card">Đang tải nội dung...</div></div>;
    }

    if (error || !lessonDetail || !lessonId) {
        return (
            <div className="lesson-detail-shell">
                <div className="glass-card error-state">
                    <p>{error ?? "Không thể hiển thị bài giảng."}</p>
                </div>
            </div>
        );
    }

    const hasDocument = !!lessonDetail.documentUrl;
    const hasSubFile = !!lessonDetail.subFileUrl;

    return (
        <div className="lesson-detail-shell">
            <section className="doc-overview glass-card">
                <div className="doc-overview-main">
                    <p className="eyebrow text-white-50">StudyShare · Video bài giảng</p>
                    <h1>{lessonDetail.title}</h1>
                    <p>{lessonDetail.description}</p>

                    <div className="doc-meta-chips">
                        {lessonDetail.categoryName && <span className="chip ghost">{lessonDetail.categoryName}</span>}
                        <span className="chip ghost">
                            <i className="fa fa-eye" /> {lessonDetail.viewsCount?.toLocaleString("vi-VN") ?? 0} lượt xem
                        </span>
                    </div>

                    <div className="stat-grid">
                        {meta.map((item) => (
                            <div className="stat-card" key={item.label}>
                                <p className="text-muted">{item.label}</p>
                                <strong>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="document-actions">
                    {hasDocument && (
                        <button
                            type="button"
                            onClick={handleDownloadDocument}
                            className="btn-elevated"
                            disabled={downloadingDoc}
                        >
                            {downloadingDoc ? "Đang xử lý..." : (
                                <>
                                    <i className="fa fa-download" /> Tải tài liệu
                                </>
                            )}
                        </button>
                    )}
                    {hasSubFile && (
                        <button
                            type="button"
                            onClick={handleDownloadSubFile}
                            className="btn-outline"
                            disabled={downloadingSub}
                        >
                            {downloadingSub ? "Đang xử lý..." : (
                                <>
                                    <i className="fa fa-download" /> Tải file bổ sung
                                </>
                            )}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        className={`btn-outline favorite-toggle ${favoriteId ? "active" : ""}`}
                        disabled={favoriteLoading}
                    >
                        <i className={`fa ${favoriteId ? "fa-heart" : "fa-heart-o"}`} />{" "}
                        {favoriteId ? "Đã lưu" : "Lưu vào kho"}
                    </button>
                    <button onClick={() => window.history.back()} className="btn-outline">
                        Quay lại thư viện
                    </button>
                </div>
            </section>

            <section className="lesson-content-layout">
                <div className="rail-pane lesson-video-pane">
                    <VideoComp
                        lessonId={lessonId}
                        thumbnailUrl={lessonDetail.thumbnailUrl}
                    />
                </div>

                {hasDocument ? (
                    <div className="rail-pane lesson-document-pane">
                        <DocumentComp
                            lessonId={lessonId}
                        />
                    </div>
                ) : (
                    <div className="rail-pane lesson-sidebar-pane compact">
                        <LessonRightSidebar
                            userId={lessonDetail.userId}
                            currentLessonId={lessonDetail.id}
                        />
                    </div>
                )}
            </section>

            {lessonDetail.categoryId && (
                <section className="glass-card doc-related">
                    <CarouselComp
                        categoryId={lessonDetail.categoryId}
                        currentItemId={lessonDetail.id}
                        type="lesson"
                    />
                </section>
            )}

            {lessonId && (
                <section className="glass-card doc-feedback">
                    <RatingComp lessonId={lessonId} />
                </section>
            )}

            {lessonId && (
                <section className="glass-card doc-feedback">
                    <CommentComp lessonId={lessonId} />
                </section>
            )}
        </div>
    );
};

export default LessonDetail;