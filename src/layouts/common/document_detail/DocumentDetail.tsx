import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PdfComp from "./components/pdfComp";
import { getDocumentById, getAllDocumentByCategory } from "../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";

/**
 * DocumentDetail.tsx
 * - Sửa logic slide list: lấy số trang thực tế nếu có, fallback sẽ chờ PdfComp gọi onLoadPages.
 * - Khi click slide => setActiveSlide => truyền xuống PdfComp qua prop `pageNumber`.
 *
 * LƯU Ý:
 * - Nếu PdfComp chưa nhận prop `pageNumber` để hiển thị trang cụ thể, hãy thêm support:
 *    <PdfComp pageNumber={activeSlide} onLoadPages={(n)=>...} ... />
 * - Nếu PdfComp có thể tự báo số trang, nó nên gọi `onLoadPages(totalPages)`.
 * - Mình cố gắng không thay đổi logic API / dữ liệu, chỉ bổ sung props cho viewer.
 */

const DocumentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const docId = Number(id);

    const [document, setDocument] = useState<DocumentResponse | null>(null);
    const [relatedDocuments, setRelatedDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Số trang thực tế của PDF. Nếu null => chưa biết, dùng placeholder until known
    const [totalPages, setTotalPages] = useState<number | null>(null);

    // Trang đang hiển thị (1-based)
    const [activeSlide, setActiveSlide] = useState<number>(1);

    // Tải document
    useEffect(() => {
        if (!docId) {
            setError("Không tìm thấy tài liệu.");
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                const data = await getDocumentById(docId);
                setDocument(data?.result ?? null);
            } catch (err) {
                setError("Không thể tải chi tiết tài liệu.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [docId]);

    // Tải tài liệu liên quan theo category
    useEffect(() => {
        if (!document?.categoryId) return;
        const fetchRelated = async () => {
            try {
                const data = await getAllDocumentByCategory(document.categoryId);
                const filtered = (data?.resultList ?? []).filter((item) => item.id !== document.id && item.status === "PUBLISHED");
                setRelatedDocuments(filtered.slice(0, 8));
            } catch (err) {
                // im lặng, chỉ log nếu cần
                console.error("fetch related error", err);
            }
        };
        fetchRelated();
    }, [document]);

    // Meta info
    const meta = useMemo(() => {
        if (!document) return [];
        return [
            { label: "Danh mục", value: document.categoryName ?? "Chưa rõ" },
            { label: "Lượt xem", value: document.viewsCount?.toLocaleString("vi-VN") ?? "0" },
            { label: "Lượt tải", value: document.downloadsCount?.toLocaleString("vi-VN") ?? "0" },
            {
                label: "Cập nhật",
                value: document.updatedAt
                    ? new Date(document.updatedAt).toLocaleDateString("vi-VN")
                    : "Chưa rõ",
            },
        ];
    }, [document]);

    // Nếu API trả số trang (giả sử có trường pageCount), dùng luôn
    useEffect(() => {
        if (document && (document as any).pageCount && !(totalPages && totalPages > 0)) {
            const n = Number((document as any).pageCount);
            if (!Number.isNaN(n) && n > 0) {
                setTotalPages(n);
                // ensure activeSlide is in-range
                setActiveSlide((prev) => (prev > n ? 1 : prev));
            }
        }
    }, [document, totalPages]);

    // Helper: gọi khi PdfComp báo số trang thực tế
    const handlePdfLoadedPages = (pages: number) => {
        if (!pages || pages <= 0) return;
        setTotalPages(pages);
        // nếu activeSlide nằm ngoài range, reset về 1
        setActiveSlide((prev) => (prev < 1 || prev > pages ? 1 : prev));
    };

    if (loading) {
        return <div className="document-detail loading-state p-4">Đang tải nội dung...</div>;
    }

    if (error || !document || !docId) {
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
                    <h2 className="fw-bold">{document.title}</h2>
                    <p className="text-secondary">{document.description}</p>

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
                    <a
                        href={`http://localhost:8080/api/documents/download-file?fileName=${document.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary mb-2 w-100"
                    >
                        <i className="fa fa-download me-2" /> Tải xuống
                    </a>

                    <button onClick={() => window.history.back()} className="btn btn-outline-secondary w-100">
                        Quay lại
                    </button>
                </div>
            </div>

            {/* BODY CONTENT */}
            <div className="row">

                {/* LEFT SIDEBAR – SLIDE LIST */}
                <div className="col-md-2">
                    <div className="border rounded p-3 shadow-sm bg-white" style={{ maxHeight: "75vh", overflowY: "auto" }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <strong>Slides</strong>
                            <div>
                                <button
                                    className="btn btn-sm btn-link p-0 me-2"
                                    onClick={() => setActiveSlide(1)}
                                >
                                    Lên đầu
                                </button>
                                <button
                                    className="btn btn-sm btn-link p-0"
                                    onClick={() => {
                                        if (totalPages) setActiveSlide(totalPages);
                                    }}
                                    disabled={!totalPages}
                                >
                                    Cuối
                                </button>
                            </div>
                        </div>

                        <div className="list-group">
                            {Array.from({ length: maxShown }, (_, i) => i + 1).map((num) => {
                                // Nếu totalPages known và num > totalPages thì ẩn
                                if (totalPages && num > totalPages) return null;
                                return (
                                    <button
                                        key={num}
                                        onClick={() => setActiveSlide(num)}
                                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${num === activeSlide ? "active" : ""}`}
                                        title={`Trang ${num}`}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div style={{ width: 44, height: 32, background: "#f3f3f3", borderRadius: 4, marginRight: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                                                {num}
                                            </div>
                                            <div style={{ textAlign: "left" }}>
                                                <div style={{ fontSize: 13, fontWeight: 600 }}>Trang {num}</div>
                                            </div>
                                        </div>

                                        {/* {num === activeSlide && <small className="badge bg-light text-dark">Đang xem</small>} */}
                                    </button>
                                );
                            })}

                            {/* Nếu có nhiều trang bị giới hạn hiển thị */}
                            {visibleSlidesCount > maxShown && (
                                <div className="mt-2 text-center">
                                    <small className="text-muted">... còn {visibleSlidesCount - maxShown} trang nữa</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MIDDLE – PDF VIEWER */}
                <div className="col-md-7">
                    <div className="border rounded shadow-sm bg-white p-2" style={{ minHeight: "70vh" }}>
                        {/*
                          Ghi chú về PdfComp props:
                          - pageNumber: (number) trang hiện tại (1-based). PdfComp nên đổi trang khi prop này thay đổi.
                          - onLoadPages: (pages: number) callback để PdfComp báo lại số trang thực tế khi load xong.
                          Nếu PdfComp hiện tại chưa hỗ trợ, vui lòng thêm 2 prop này vào PdfComp để tương thích.
                        */}
                        <PdfComp
                            docId={docId}
                            pageNumber={activeSlide}      // truyền trang muốn hiển thị
                            onLoadPages={handlePdfLoadedPages} // callback để PdfComp báo số trang thực tế
                        />
                    </div>
                </div>

                {/* RIGHT SIDEBAR – RELATED DOCS */}
                <div className="col-md-3">
                    <div className="border rounded p-3 shadow-sm bg-white" style={{ maxHeight: "75vh", overflowY: "auto" }}>
                        <h5 className="fw-bold mb-3">Gợi ý thêm</h5>

                        {relatedDocuments.length === 0 && (
                            <p className="text-muted">Chưa có tài liệu liên quan.</p>
                        )}

                        <div className="list-group">
                            {relatedDocuments.map((item) => (
                                <Link
                                    to={`/document/${item.id}`}
                                    className="list-group-item list-group-item-action"
                                    key={item.id}
                                >
                                    <strong className="d-block">{item.title}</strong>
                                    <small className="text-muted">{item.description}</small>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DocumentDetail;
