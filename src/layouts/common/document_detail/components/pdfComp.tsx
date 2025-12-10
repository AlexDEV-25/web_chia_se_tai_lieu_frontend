import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

interface Props {
    docId: number;
    pageNumber: number;
    onLoadPages?: (pages: number) => void;
}

const PdfComp: React.FC<Props> = ({ docId, pageNumber, onLoadPages }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [internalPage, setInternalPage] = useState<number>(1);

    /** Khi PDF load xong */
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);

        // báo lên DocumentDetail để cập nhật totalPages
        if (onLoadPages) onLoadPages(numPages);

        // khi load file mới → luôn về trang 1
        setInternalPage(1);
    }

    /** Nếu DocumentDetail đổi trang → PdfComp đổi theo */
    useEffect(() => {
        if (!numPages) return;

        if (pageNumber >= 1 && pageNumber <= numPages) {
            setInternalPage(pageNumber);
        }
    }, [pageNumber, numPages]);

    /** Nút Next/Prev */
    const nextPage = () => {
        if (numPages && internalPage < numPages) {
            setInternalPage(internalPage + 1);
        }
    };

    const prevPage = () => {
        if (internalPage > 1) {
            setInternalPage(internalPage - 1);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Document
                file={`http://localhost:8080/api/documents/${docId}/file`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Đang tải PDF..."
                error="Không thể mở tài liệu PDF."
            >
                <Page
                    pageNumber={internalPage}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                />
            </Document>

            <p>
                Trang {internalPage} / {numPages || "?"}
            </p>

            <button onClick={prevPage} disabled={internalPage <= 1}>
                ◀ Trang trước
            </button>

            <button
                onClick={nextPage}
                disabled={numPages ? internalPage >= numPages : true}
                style={{ marginLeft: 10 }}
            >
                Trang sau ▶
            </button>
        </div>
    );
};

export default PdfComp;
