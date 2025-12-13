import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PdfComp from "./components/pdfComp";
import { downloadFile, getDocumentById, increaseDownload, increaseView } from "../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import CommentComp from "./components/commentComp";
import LeftSidebar from "./components/leftSidebar";
import RightSidebar from "./components/rightSidebar";
import DocumentCarousel from "./components/documentCarousel";
import RatingComp from "./components/ratingComp";

const DocumentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const docId = Number(id);

    const [documentDetail, setDocumentDetail] = useState<DocumentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Số trang thực tế của PDF. Nếu null => chưa biết, dùng placeholder until known
    const [totalPages, setTotalPages] = useState<number | null>(null);

    // Trang đang hiển thị (1-based)
    const [activeSlide, setActiveSlide] = useState<number>(1);
    const [downloading, setDownloading] = useState(false);

    // Tải thông tin document
    useEffect(() => {
        if (!docId) {
            setError("Không tìm thấy tài liệu.");
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                const data = await getDocumentById(docId);
                setDocumentDetail(data?.result ?? null);
            } catch (err) {
                setError("Không thể tải chi tiết tài liệu.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [docId]);

    // Tăng lượt xem khi người dùng mở trang
    useEffect(() => {
        if (!docId) return;
        increaseView(docId).catch(() => undefined);
    }, [docId]);


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
        // nếu activeSlide nằm ngoài range, reset về 1
        setActiveSlide((prev) => (prev < 1 || prev > pages ? 1 : prev));
    };

    const handleDownload = async () => {
        if (!documentDetail) return;
        setDownloading(true);
        try {
            await increaseDownload(documentDetail.id);
            const blob = await downloadFile(documentDetail.fileUrl);
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = documentDetail.title ? `${documentDetail.title}.pdf` : "document.pdf";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Vui lòng đăng nhập để tải tài liệu");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return <div className="document-detail loading-state p-4">Đang tải nội dung...</div>;
    }

    if (error || !documentDetail || !docId) {
        return (
            <div className="document-detail error-state p-4">
                <p>{error ?? "Không thể hiển thị tài liệu."}</p>
            </div>
        );
    }

    // Số thumbnail sẽ hiển thị: nếu biết totalPages lấy full, còn chưa biết thì hiển thị một số placeholder ngắn (ví dụ 8)
    const visibleSlidesCount = totalPages ?? 8;
    // Giới hạn hiển thị danh sách lớn (nếu quá nhiều trang, chỉ show tối đa 50 để tránh quá dài)
    const maxShown = Math.min(visibleSlidesCount, 50);

    return (
        <div className="container py-4">

            {/* HEADER */}
            <div className="row mb-4">
                <div className="col-md-9">
                    <p className="text-muted small mb-1">StudyShare · Tài liệu</p>
                    <h2 className="fw-bold">{documentDetail.title}</h2>
                    <p className="text-secondary">{documentDetail.description}</p>

                    <div className="row g-3 mt-3">
                        {meta.map((item) => (
                            <div className="col-6 col-md-3" key={item.label}>
                                <div className="p-3 border rounded shadow-sm bg-white">
                                    <p className="mb-1 text-muted small">{item.label}</p>
                                    <strong>{item.value}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-3 text-md-end mt-3 mt-md-0">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="btn btn-primary mb-2 w-100"
                        disabled={downloading}
                    >
                        {downloading ? "Đang xử lý..." : (
                            <>
                                <i className="fa fa-download me-2" /> Tải xuống
                            </>
                        )}
                    </button>

                    <button onClick={() => window.history.back()} className="btn btn-outline-secondary w-100">
                        Quay lại
                    </button>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div className="row">

                {/* LEFT SIDEBAR – SLIDE LIST */}
                <div className="col-md-2">
                    <LeftSidebar
                        activeSlide={activeSlide}
                        maxShown={maxShown}
                        visibleSlidesCount={visibleSlidesCount}
                        totalPages={totalPages}
                        onSelectSlide={setActiveSlide}
                        onJumpToStart={() => setActiveSlide(1)}
                        onJumpToEnd={() => {
                            if (totalPages) setActiveSlide(totalPages);
                        }}
                    />
                </div>

                {/* MIDDLE – PDF VIEWER */}
                <div className="col-md-7">
                    <div className="border rounded shadow-sm bg-white p-2" style={{ minHeight: "70vh" }}>
                        <PdfComp
                            docId={docId}
                            pageNumber={activeSlide}      // truyền trang muốn hiển thị
                            onLoadPages={handlePdfLoadedPages} // callback để PdfComp báo số trang thực tế
                        />
                    </div>
                </div>

                {/* RIGHT SIDEBAR – RELATED DOCS */}
                <div className="col-md-3">
                    <RightSidebar
                        userId={documentDetail.userId}
                        currentDocumentId={documentDetail.id}
                    />
                </div>

            </div>

            {/* CAROUSEL – SAME CATEGORY */}
            {documentDetail.categoryId && (
                <DocumentCarousel
                    categoryId={documentDetail.categoryId}
                    currentDocumentId={documentDetail.id}
                />
            )}

            {/* RATING */}
            {docId && (
                <div className="row mt-4">
                    <div className="col-md-9">
                        <RatingComp docId={docId} />
                    </div>
                </div>
            )}

            {/* COMMENTS */}
            {docId && (
                <div className="row mt-4">
                    <div className="col-md-9">
                        <CommentComp docId={docId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentDetail;
