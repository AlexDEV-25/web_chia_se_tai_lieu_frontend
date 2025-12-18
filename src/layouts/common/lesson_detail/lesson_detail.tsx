import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import VideoComp from "./components/videoComp";
import DocumentComp from "./components/documentComp";
import { downloadDocument, downloadSubFile, getLessonById, increaseView } from "../../../apis/LessonApi";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import LessonRightSidebar from "./components/lessonRightSidebar";
import DocumentCarousel from "../document_detail/components/documentCarousel";
import RatingComp from "../document_detail/components/ratingComp";
import CommentComp from "../document_detail/components/commentComp";

const LessonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const lessonId = Number(id);

    const [lessonDetail, setLessonDetail] = useState<LessonResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingDoc, setDownloadingDoc] = useState(false);
    const [downloadingSub, setDownloadingSub] = useState(false);

    useEffect(() => {
        if (!lessonId) {
            setError("Không tìm thấy bài giảng.");
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                const data = await getLessonById(lessonId);
                setLessonDetail(data?.result ?? null);
            } catch (err) {
                setError("Không thể tải chi tiết bài giảng.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [lessonId]);

    useEffect(() => {
        if (!lessonId) return;
        increaseView(lessonId).catch(() => undefined);
    }, [lessonId]);

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
        if (!lessonDetail?.documentUrl) return;
        setDownloadingDoc(true);
        try {
            const blob = await downloadDocument(lessonDetail.documentUrl);
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = lessonDetail.title ? `${lessonDetail.title}.pdf` : "document.pdf";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Vui lòng đăng nhập để tải tài liệu");
        } finally {
            setDownloadingDoc(false);
        }
    };

    const handleDownloadSubFile = async () => {
        if (!lessonDetail?.subFileUrl) return;
        setDownloadingSub(true);
        try {
            const blob = await downloadSubFile(lessonDetail.subFileUrl);
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = lessonDetail.title ? `${lessonDetail.title}.rar` : "subfile.rar";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Vui lòng đăng nhập để tải file bổ sung");
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
                    <button onClick={() => window.history.back()} className="btn-outline">
                        Quay lại thư viện
                    </button>
                </div>
            </section>

            <section className="lesson-content-layout">
                <div className="rail-pane lesson-video-pane">
                    <VideoComp
                        lessonId={lessonId}
                        lessonUrl={lessonDetail.lessonUrl}
                        thumbnailUrl={lessonDetail.thumbnailUrl}
                    />
                </div>

                {hasDocument ? (
                    <div className="rail-pane lesson-document-pane">
                        <DocumentComp
                            lessonId={lessonId}
                            documentUrl={lessonDetail.documentUrl}
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
                    <DocumentCarousel
                        categoryId={lessonDetail.categoryId}
                        currentDocumentId={lessonDetail.id}
                    />
                </section>
            )}

            {lessonId && (
                <section className="glass-card doc-feedback">
                    <RatingComp docId={lessonId} />
                </section>
            )}

            {lessonId && (
                <section className="glass-card doc-feedback">
                    <CommentComp docId={lessonId} />
                </section>
            )}
        </div>
    );
};

export default LessonDetail;