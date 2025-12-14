import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";

interface Props {
    docId: number;
    pageNumber: number;
    onLoadPages?: (pages: number) => void;
    onPageChange?: (page: number) => void;
}

const PdfComp: React.FC<Props> = ({ docId, pageNumber, onLoadPages, onPageChange }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [internalPage, setInternalPage] = useState<number>(pageNumber ?? 1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [renderWidth, setRenderWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        setInternalPage(pageNumber);
    }, [pageNumber]);

    useEffect(() => {
        if (!containerRef.current || typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setRenderWidth(entry.contentRect.width);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setErrorMessage(null);
        onLoadPages?.(numPages);
    }

    function onDocumentLoadError() {
        setErrorMessage("Không thể mở tài liệu PDF.");
    }

    const goToPage = (target: number) => {
        if (!numPages) return;
        if (target < 1 || target > numPages) return;
        setInternalPage(target);
        onPageChange?.(target);
    };

    const handlePrev = () => goToPage(internalPage - 1);
    const handleNext = () => goToPage(internalPage + 1);

    return (
        <div className="pdf-viewer-shell">
            <div className="pdf-stage" ref={containerRef}>
                <Document
                    file={`http://localhost:8080/api/documents/${docId}/file`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading="Đang tải PDF..."
                    error="Không thể mở tài liệu PDF."
                >
                    <Page
                        pageNumber={internalPage}
                        width={renderWidth ? Math.min(renderWidth, 860) : undefined}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>
            </div>

            {errorMessage && <div className="error-text text-center">{errorMessage}</div>}

            <div className="pdf-toolbar">
                <div className="pdf-nav">
                    <button type="button" onClick={handlePrev} disabled={internalPage <= 1}>
                        <i className="fa fa-chevron-left" /> Trang trước
                    </button>
                    <div className="pdf-page-indicator">
                        Trang {internalPage} / {numPages || "?"}
                    </div>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!numPages || internalPage >= numPages}
                    >
                        Trang sau <i className="fa fa-chevron-right" />
                    </button>
                </div>
                <input
                    type="range"
                    className="pdf-progress"
                    min={1}
                    max={numPages || 1}
                    value={internalPage}
                    onChange={(event) => goToPage(Number(event.target.value))}
                    disabled={!numPages}
                />
            </div>
        </div>
    );
};

export default PdfComp;
