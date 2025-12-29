import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";

interface Props {
    fileUrl: string | null;
    maxRenderWidth?: number;

    /** controlled page (optional) */
    page?: number;
    onPageChange?: (page: number) => void;

    /** callbacks */
    onLoadPages?: (pages: number) => void;

    /** empty state */
    emptyFallback?: React.ReactNode;
}

const DocumentViewComp: React.FC<Props> = ({
    fileUrl,
    maxRenderWidth = 860,
    page,
    onPageChange,
    onLoadPages,
    emptyFallback,
}) => {
    const [numPages, setNumPages] = useState<number>();
    const [internalPage, setInternalPage] = useState<number>(page ?? 1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [renderWidth, setRenderWidth] = useState<number>();

    const isControlled = page !== undefined;
    const currentPage = isControlled ? page! : internalPage;

    /* sync controlled page */
    useEffect(() => {
        if (isControlled) {
            setInternalPage(page!);
        }
    }, [page, isControlled]);

    /* resize observer */
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

    if (!fileUrl) {
        return <>{emptyFallback ?? null}</>;
    }

    const goToPage = (target: number) => {
        if (!numPages || target < 1 || target > numPages) return;

        if (!isControlled) {
            setInternalPage(target);
        }
        onPageChange?.(target);
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setErrorMessage(null);
        onLoadPages?.(numPages);
        if (!isControlled) setInternalPage(1);
    }

    function onDocumentLoadError() {
        setErrorMessage("Không thể mở tài liệu PDF.");
    }

    return (
        <div className="pdf-viewer-shell">
            <div className="pdf-stage" ref={containerRef}>
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading="Đang tải PDF..."
                    error="Không thể mở tài liệu PDF."
                >
                    <Page
                        pageNumber={currentPage}
                        width={renderWidth ? Math.min(renderWidth, maxRenderWidth) : undefined}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>
            </div>

            {errorMessage && <div className="error-text text-center">{errorMessage}</div>}

            <div className="pdf-toolbar">
                <div className="pdf-nav">
                    <button onClick={prevPage} disabled={currentPage <= 1}>
                        <i className="fa fa-chevron-left" /> Trang trước
                    </button>

                    <div className="pdf-page-indicator">
                        Trang {currentPage} / {numPages ?? "?"}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={!numPages || currentPage >= numPages}
                    >
                        Trang sau <i className="fa fa-chevron-right" />
                    </button>
                </div>

                <input
                    type="range"
                    className="pdf-progress"
                    min={1}
                    max={numPages ?? 1}
                    value={currentPage}
                    onChange={(e) => goToPage(Number(e.target.value))}
                    disabled={!numPages}
                />
            </div>
        </div>
    );
};

export default DocumentViewComp;
