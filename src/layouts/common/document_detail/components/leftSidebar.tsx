interface LeftSidebarProps {
    activeSlide: number;
    maxShown: number;
    visibleSlidesCount: number;
    totalPages: number | null;
    onSelectSlide: (slide: number) => void;
    onJumpToStart: () => void;
    onJumpToEnd: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    activeSlide,
    maxShown,
    visibleSlidesCount,
    totalPages,
    onSelectSlide,
    onJumpToStart,
    onJumpToEnd,
}) => {
    return (
        <div className="border rounded p-3 shadow-sm bg-white" style={{ maxHeight: "75vh", overflowY: "auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <strong>Slides</strong>
                <div>
                    <button
                        className="btn btn-sm btn-link p-0 me-2"
                        onClick={onJumpToStart}
                    >
                        Lên đầu
                    </button>
                    <button
                        className="btn btn-sm btn-link p-0"
                        onClick={onJumpToEnd}
                        disabled={!totalPages}
                    >
                        Cuối
                    </button>
                </div>
            </div>

            <div className="list-group">
                {Array.from({ length: maxShown }, (_, i) => i + 1).map((num) => {
                    if (totalPages && num > totalPages) return null;
                    return (
                        <button
                            key={num}
                            onClick={() => onSelectSlide(num)}
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
                        </button>
                    );
                })}

                {visibleSlidesCount > maxShown && (
                    <div className="mt-2 text-center">
                        <small className="text-muted">... còn {visibleSlidesCount - maxShown} trang nữa</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftSidebar;
