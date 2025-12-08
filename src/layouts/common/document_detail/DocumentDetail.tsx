import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PdfComp from "./components/pdfComp";
import { getDocumentById, getAllDocumentByCategory } from "../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";

const DocumentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const docId = Number(id);

    const [document, setDocument] = useState<DocumentResponse | null>(null);
    const [relatedDocuments, setRelatedDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSlide, setActiveSlide] = useState(1);

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

    useEffect(() => {
        if (!document?.categoryId) return;
        const fetchRelated = async () => {
            const data = await getAllDocumentByCategory(document.categoryId);
            const filtered = (data?.resultList ?? []).filter((item) => item.id !== document.id && item.status === "PUBLISHED");
            setRelatedDocuments(filtered.slice(0, 8));
        };
        fetchRelated();
    }, [document]);

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

    if (loading) {
        return <div className="document-detail loading-state">Đang tải nội dung...</div>;
    }

    if (error || !document || !docId) {
        return (
            <div className="document-detail error-state">
                <p>{error ?? "Không thể hiển thị tài liệu."}</p>
            </div>
        );
    }

    return (
        <div className="document-detail">
            <header className="detail-header">
                <div>
                    <p className="eyebrow">StudyShare · Tài liệu</p>
                    <h1>{document.title}</h1>
                    <p className="doc-description">{document.description}</p>

                    <div className="meta-grid">
                        {meta.map((item) => (
                            <div key={item.label} className="meta-card">
                                <p>{item.label}</p>
                                <strong>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="detail-actions">
                    <a
                        href={`http://localhost:8080/api/documents/download-file?fileName=${document.fileUrl}`}
                        className="btn-pill primary"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <i className="fa fa-download me-2" />
                        Tải xuống
                    </a>
                    <button
                        className="btn-pill ghost"
                        onClick={() => window.history.back()}
                    >
                        Quay lại
                    </button>
                </div>
            </header>

            <div className="detail-body">
                <aside className="slide-column">
                    <div className="slide-column__head">
                        <span>Slides</span>
                        <button className="btn-link" onClick={() => setActiveSlide(1)}>
                            Lên đầu
                        </button>
                    </div>
                    <div className="slide-list">
                        {Array.from({ length: 8 }, (_, index) => index + 1).map((slide) => (
                            <button
                                key={slide}
                                className={`slide-button ${slide === activeSlide ? "active" : ""}`}
                                onClick={() => setActiveSlide(slide)}
                            >
                                <div className="slide-thumb">Trang {slide}</div>
                            </button>
                        ))}
                    </div>
                </aside>

                <div className="viewer-column">
                    <PdfComp docId={docId} />
                </div>

                <aside className="recommend-column">
                    <h3>Gợi ý thêm</h3>
                    {relatedDocuments.length === 0 && <p>Chưa có tài liệu liên quan.</p>}
                    <ul>
                        {relatedDocuments.map((item) => (
                            <li key={item.id}>
                                <Link to={`/document/${item.id}`}>
                                    <strong>{item.title}</strong>
                                    <p>{item.description}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default DocumentDetail;