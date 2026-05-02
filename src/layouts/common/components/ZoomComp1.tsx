import React from "react";

interface ZoomCompProps {
    zoomLevel: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    isVisible: boolean;
    onToggleVisibility: () => void;
}

const ZoomComp: React.FC<ZoomCompProps> = ({
    zoomLevel,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    isVisible,
    onToggleVisibility,
}) => {
    if (!isVisible) {
        return (
            <button
                onClick={onToggleVisibility}
                className="pdf-zoom-toggle-btn"
                title="Hiển thị điều khiển zoom"
            >
                <i className="fa fa-search-plus" />
            </button>
        );
    }

    return (
        <div className="pdf-zoom-controls-floating">
            <button onClick={onToggleVisibility} title="Ẩn điều khiển zoom" className="pdf-zoom-btn toggle-btn">
                <i className="fa fa-times" />
            </button>

            <button onClick={onZoomOut} title="Zoom out" className="pdf-zoom-btn">
                <i className="fa fa-minus" />
            </button>

            <span className="pdf-zoom-indicator">{zoomLevel}%</span>

            <button onClick={onZoomIn} title="Zoom in" className="pdf-zoom-btn">
                <i className="fa fa-plus" />
            </button>

            <button onClick={onResetZoom} title="Reset zoom" className="pdf-zoom-btn">
                <i className="fa fa-undo" />
            </button>
        </div>
    );
};

export default ZoomComp;