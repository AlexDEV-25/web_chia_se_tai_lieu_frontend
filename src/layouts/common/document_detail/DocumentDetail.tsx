import { useEffect, useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import CenterComp from "./components/CenterComp";
import { downloadFile, getDocumentById, increaseDownload, increaseView } from "../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import CommentComp from "../components/CommentComp";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import CarouselComp from "../components/CarouselComp";
import RatingComp from "../components/RatingComp";
import ReportComp from "../components/ReportComp";
import { UserContext } from "../../../AppContext";
import { addFavoriteDocument, getDocumentFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";

const DocumentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const docId = Number(id);

    const userCtx = useContext(UserContext);
    const currentUser = userCtx?.currentUser;
    const currentUserId = currentUser?.id ?? null;

    const [documentDetail, setDocumentDetail] = useState<DocumentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Số trang thực tế của PDF. Nếu null => chưa biết, dùng placeholder until known
    const [totalPages, setTotalPages] = useState<number | null>(null);

    // Trang đang hiển thị (1-based)
    const [activeSlide, setActiveSlide] = useState<number>(1);
    const [downloading, setDownloading] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    // Tải thông tin document
    useEffect(() => {
        if (!docId) {
            setError(ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                const response = await getDocumentById(docId);
                setDocumentDetail(response?.result ?? null);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_LOAD_FAILED);
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [docId]);

    useEffect(() => {
        if (!docId) return;

        const timer = setTimeout(async () => {
            try {
                await increaseView(docId);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.INCREASE_VIEW_FAILED);
                console.error(message);
            }
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, [docId]);

    useEffect(() => {
        if (!docId || !currentUserId) {
            setFavoriteId(null);
            return;
        }

        let isMounted = true;

        const fetchFavoriteState = async () => {
            try {
                const favoritesResponse = await getDocumentFavoritesByUser();
                if (!isMounted) return;
                const favorites = favoritesResponse.resultList ?? [];
                const existing = favorites.find((fav) => fav.contentId === docId);
                setFavoriteId(existing ? existing.id : null);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.FAVORITES_LOAD_FAILED);
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
    }, [docId, currentUserId]);

    const handleToggleFavorite = async () => {
        if (!docId) return;
        if (!currentUserId) {
            alert(ERROR_MESSAGES.LOGIN_REQUIRED_FAVORITE);
            return;
        }

        setFavoriteLoading(true);

        try {
            if (favoriteId) {
                await removeFavorite(favoriteId);
                setFavoriteId(null);
            } else {
                const response = await addFavoriteDocument({
                    userId: currentUserId,
                    contentId: docId,
                    type: 'DOCUMENT',
                });
                const saved = response.result;
                console.log('Added favorite:', saved);
                if (saved) {
                    setFavoriteId(saved.id);
                }
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED);
            console.error(message);
            alert(message);
        } finally {
            setFavoriteLoading(false);
        }
    };

    // Meta info
    const meta = useMemo(() => {
        if (!documentDetail) return [];
        return [
            { label: "Danh mục", value: documentDetail.categoryName ?? "Chưa rõ" },
            { label: "Lượt xem", value: documentDetail.viewsCount?.toLocaleString("vi-VN") ?? "0" },
            { label: "Lượt tải", value: documentDetail.downloadsCount?.toLocaleString("vi-VN") ?? "0" },
            {
                label: "Cập nhật",
                value: documentDetail.updatedAt
                    ? new Date(documentDetail.updatedAt).toLocaleDateString("vi-VN")
                    : "Chưa rõ",
            },
        ];
    }, [documentDetail]);

    // Helper: gọi khi PdfComp báo số trang thực tế
    const handlePdfLoadedPages = (pages: number) => {
        if (!pages || pages <= 0) return;
        setTotalPages(pages);
        setActiveSlide((prev) => (prev < 1 || prev > pages ? 1 : prev));
    };

    const handleSlideSelect = (slide: number) => {
        setActiveSlide(slide);
    };

    const handleDownload = async () => {
        if (!documentDetail?.id) return;
        setDownloading(true);
        try {
            await increaseDownload(documentDetail.id);
            const blob = await downloadFile(documentDetail.id);
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = documentDetail.title ? `${documentDetail.title}.pdf` : "document.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOWNLOAD_LOGIN_REQUIRED);
            alert(message);
        } finally {
            setDownloading(false);
        }
    };


    if (loading) {
        return <div className="document-detail-shell"><div className="glass-card">Đang tải nội dung...</div></div>;
    }

    if (error || !documentDetail || !docId) {
        return (
            <div className="document-detail-shell">
                <div className="glass-card error-state">
                    <p>{error ?? "Không thể hiển thị tài liệu."}</p>
                </div>
            </div>
        );
    }

    // Số thumbnail sẽ hiển thị: nếu biết totalPages lấy full, còn chưa biết thì hiển thị một số placeholder ngắn (ví dụ 8)
    const visibleSlidesCount = totalPages ?? 8;
    // Giới hạn hiển thị danh sách lớn (nếu quá nhiều trang, chỉ show tối đa 50 để tránh quá dài)
    const maxShown = Math.min(visibleSlidesCount, 50);

    return (
        <div className="document-detail-shell">
            <section className="doc-overview glass-card">
                <div className="doc-overview-main">
                    <p className="eyebrow text-white-50">StudyShare · Slide deck</p>
                    <h1>{documentDetail.title}</h1>
                    <p>{documentDetail.description}</p>

                    <div className="doc-meta-chips">
                        {documentDetail.categoryName && <span className="chip ghost">{documentDetail.categoryName}</span>}
                        <span className="chip ghost">
                            <i className="fa fa-eye" /> {documentDetail.viewsCount?.toLocaleString("vi-VN") ?? 0} lượt xem
                        </span>
                        <span className="chip ghost">
                            <i className="fa fa-download" /> {documentDetail.downloadsCount?.toLocaleString("vi-VN") ?? 0} tải xuống
                        </span>
                        <ReportComp contentId={docId} contentType="DOCUMENT" />
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
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="btn-elevated"
                        disabled={downloading}
                    >
                        {downloading ? "Đang xử lý..." : (
                            <>
                                <i className="fa fa-download" /> Tải xuống
                            </>
                        )}
                    </button>

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

            <section className="document-layout">
                <div className="slide-panel rail-pane">
                    <LeftSidebar
                        activeSlide={activeSlide}
                        maxShown={maxShown}
                        visibleSlidesCount={visibleSlidesCount}
                        totalPages={totalPages}
                        onSelectSlide={handleSlideSelect}
                        onJumpToStart={() => setActiveSlide(1)}
                        onJumpToEnd={() => {
                            if (totalPages) setActiveSlide(totalPages);
                        }}
                    />
                </div>

                <div className="viewer-panel rail-pane">
                    <CenterComp
                        docId={docId}
                        pageNumber={activeSlide}
                        onLoadPages={handlePdfLoadedPages}
                        onPageChange={handleSlideSelect}
                    />
                </div>

                <div className="suggestion-panel rail-pane">
                    <RightSidebar
                        userId={documentDetail.userId}
                        currentDocumentId={documentDetail.id}
                    />
                </div>
            </section>

            {documentDetail.categoryId && (
                <section className="glass-card doc-related">
                    <CarouselComp
                        categoryId={documentDetail.categoryId}
                        currentItemId={documentDetail.id}
                        type="document"
                    />
                </section>
            )}

            {docId && (
                <section className="glass-card doc-feedback">
                    <RatingComp docId={docId} />
                </section>
            )}

            {docId && (
                <section className="glass-card doc-feedback">
                    <CommentComp docId={docId} />
                </section>
            )}
        </div>
    );
};

export default DocumentDetail;
