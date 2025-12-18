import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";

interface DocumentCompProps {
    lessonId?: number;
}

const MAX_RENDER_WIDTH = 520;

const DocumentComp: React.FC<DocumentCompProps> = ({ lessonId }) => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [renderWidth, setRenderWidth] = useState<number | undefined>(undefined);

    const fileSource = lessonId
        ? `http://localhost:8080/api/lessons/${lessonId}/document`
        : null;

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

    if (!fileSource) {
        return (
            <div className="lesson-document-empty">
                <i className="fa fa-file-pdf-o" />
                <p>Tài liệu bài giảng sẽ được cập nhật sớm.</p>
            </div>
        );
    }

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
        setErrorMessage(null);
    }

    function onDocumentLoadError() {
        setErrorMessage("Không thể mở tài liệu PDF.");
    }

    const nextPage = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    return (
        <div className="lesson-doc-viewer">
            <div className="pdf-stage" ref={containerRef}>
                <Document
                    file={fileSource}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading="Đang tải tài liệu..."
                    error="Không thể mở tài liệu."
                >
                    <Page
                        pageNumber={pageNumber}
                        width={renderWidth ? Math.min(renderWidth, MAX_RENDER_WIDTH) : undefined}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>
            </div>

            {errorMessage && <div className="error-text text-center">{errorMessage}</div>}

            <div className="pdf-toolbar">
                <div className="pdf-nav">
                    <button onClick={prevPage} disabled={pageNumber <= 1}>
                        <i className="fa fa-chevron-left" /> Trang trước
                    </button>
                    <div className="pdf-page-indicator">
                        Trang {pageNumber} / {numPages ?? "?"}
                    </div>
                    <button
                        onClick={nextPage}
                        disabled={numPages ? pageNumber >= numPages : true}
                    >
                        Trang sau <i className="fa fa-chevron-right" />
                    </button>
                </div>
                <input
                    type="range"
                    className="pdf-progress"
                    min={1}
                    max={numPages ?? 1}
                    value={pageNumber}
                    onChange={(event) => setPageNumber(Number(event.target.value))}
                    disabled={!numPages}
                />
            </div>
        </div>
    );
};

export default DocumentComp;