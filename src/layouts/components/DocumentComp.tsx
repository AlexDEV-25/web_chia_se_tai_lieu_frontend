import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { ERROR_MESSAGES } from "../../constants/messages";
import ZoomComp from "./ZoomComp";

interface Props {
    documentUrl: string | null;
    maxRenderWidth?: number;

    /** controlled page (optional) */
    page?: number;
    onPageChange?: (page: number) => void;

    /** callbacks */
    onLoadPages?: (pages: number) => void;

    /** empty state */
    emptyFallback?: React.ReactNode;

}

const DocumentComp: React.FC<Props> = ({
    documentUrl,
    maxRenderWidth = 860,
    page,
    onPageChange,
    onLoadPages,
    emptyFallback,

}) => {
    const [numPages, setNumPages] = useState<number>();
    const [internalPage, setInternalPage] = useState<number>(page ?? 1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [showZoomControls, setShowZoomControls] = useState<boolean>(true);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const [activePointer, setActivePointer] = useState<number | null>(null);
    const [renderWidth, setRenderWidth] = useState<number>();
    const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [fileData, setFileData] = useState<string | null>(null);
    const [loadingFile, setLoadingFile] = useState<boolean>(false);
    const stageRef = useRef<HTMLDivElement | null>(null);

    const isControlled = page !== undefined;
    const currentPage = isControlled ? page! : internalPage;
    // Set document URL directly
    useEffect(() => {
        if (!documentUrl) return;

        setLoadingFile(true);
        setErrorMessage(null);

        // Dùng trực tiếp URL, không tạo blob
        const url = documentUrl;

        setFileData(url);
        setLoadingFile(false);
    }, [documentUrl]);


    /* sync controlled page */
    useEffect(() => {
        if (isControlled) {
            setInternalPage(page!);
        }
    }, [page, isControlled]);

    /* resize observer */
    useEffect(() => {
        if (!stageRef.current || typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setRenderWidth(entry.contentRect.width);
            }
        });
        observer.observe(stageRef.current);
        return () => observer.disconnect();
    }, []);

    const clampOffsets = (x: number, y: number) => {
        if (!stageRef.current || !pageDimensions) {
            return { x, y };
        }

        const { width: stageWidth, height: stageHeight } = stageRef.current.getBoundingClientRect();
        const scale = zoomLevel / 100;
        const contentWidth = pageDimensions.width * scale;
        const contentHeight = pageDimensions.height * scale;

        const maxOffsetX = Math.max(0, (contentWidth - stageWidth) / 2);
        const maxOffsetY = Math.max(0, (contentHeight - stageHeight) / 2);

        if (maxOffsetX === 0) {
            x = 0;
        } else {
            x = Math.min(maxOffsetX, Math.max(-maxOffsetX, x));
        }

        if (maxOffsetY === 0) {
            y = 0;
        } else {
            y = Math.min(maxOffsetY, Math.max(-maxOffsetY, y));
        }

        return { x, y };
    };

    const applyOffset = (x: number, y: number) => {
        setOffset(clampOffsets(x, y));
    };

    const clampZoom = (value: number) => Math.min(200, Math.max(50, value));

    const handleZoomChange = (nextZoom: number) => {
        const clamped = clampZoom(nextZoom);
        if (clamped === zoomLevel) return;
        setZoomLevel(clamped);
        if (clamped <= 100) {
            setOffset({ x: 0, y: 0 });
        } else {
            setOffset((prev) => clampOffsets(prev.x, prev.y));
        }
    };

    if (!documentUrl) {
        return <>{emptyFallback ?? null}</>;
    }

    if (loadingFile) {
        return (
            <div className="pdf-loading">
                <i className="fa fa-spinner fa-spin" />
                <p>Đang tải tài liệu...</p>
            </div>
        );
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

    const handleZoomIn = () => handleZoomChange(zoomLevel + 10);

    const handleZoomOut = () => handleZoomChange(zoomLevel - 10);

    const resetZoom = () => {
        setZoomLevel(100);
        setOffset({ x: 0, y: 0 });
    };

    const toggleZoomControls = () => {
        setShowZoomControls(!showZoomControls);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        if (zoomLevel <= 100 || !stageRef.current) return;
        if (activePointer !== null) return;
        e.preventDefault();
        const stageNode = stageRef.current;
        stageNode.setPointerCapture(e.pointerId);
        setIsDragging(true);
        setActivePointer(e.pointerId);
        dragStartRef.current = {
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || activePointer !== e.pointerId || !dragStartRef.current) return;

        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;

        applyOffset(newX, newY);
    };

    const endPointerInteraction = (e: React.PointerEvent) => {
        if (activePointer !== e.pointerId) return;
        const stageNode = stageRef.current;
        if (stageNode?.hasPointerCapture?.(e.pointerId)) {
            stageNode.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);
        dragStartRef.current = null;
        setActivePointer(null);
    };

    const handlePageRenderSuccess = (page: any) => {
        setPageDimensions({ width: page.width, height: page.height });
        setOffset({ x: 0, y: 0 });
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setErrorMessage(null);
        onLoadPages?.(numPages);
        if (!isControlled) setInternalPage(1);
    }

    function onDocumentLoadError() {
        setErrorMessage(ERROR_MESSAGES.PDF_LOAD_ERROR);
    }

    return (
        <div className="pdf-viewer-shell">
            <div className="pdf-stage">
                <div
                    className="pdf-stage-canvas"
                    ref={stageRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endPointerInteraction}
                    onPointerLeave={endPointerInteraction}
                    onPointerCancel={endPointerInteraction}
                    data-drag-state={isDragging ? "dragging" : zoomLevel > 100 ? "ready" : "disabled"}
                    style={{
                        touchAction: zoomLevel > 100 ? "none" : "pan-y",
                        cursor: isDragging ? "grabbing" : zoomLevel > 100 ? "grab" : "default",
                    }}
                >
                    <div
                        className="pdf-stage-content"
                        style={{
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomLevel / 100})`,
                            transition: isDragging ? "none" : "transform 0.2s ease-out",
                        }}
                    >
                        {fileData && !loadingFile && !errorMessage ? (
                            <Document
                                key={fileData}
                                file={fileData}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                loading="Đang tải PDF..."
                                error={ERROR_MESSAGES.PDF_LOAD_ERROR}
                            >
                                <Page
                                    pageNumber={currentPage}
                                    width={renderWidth ? Math.min(renderWidth, maxRenderWidth) : undefined}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                    onRenderSuccess={handlePageRenderSuccess}
                                />
                            </Document>
                        ) : (
                            <div className="pdf-loading">
                                <i className="fa fa-spinner fa-spin" />
                                <p>{errorMessage || "Đang tải tài liệu..."}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Zoom Controls */}
                <ZoomComp
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onResetZoom={resetZoom}
                    isVisible={showZoomControls}
                    onToggleVisibility={toggleZoomControls}
                />
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


export default DocumentComp;
