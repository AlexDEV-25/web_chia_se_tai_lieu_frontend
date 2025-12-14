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
        <div className="slide-content">
            <div className="slide-header">
                <strong>Slides</strong>
                <div className="slide-nav">
                    <button type="button" onClick={onJumpToStart}>
                        Lên đầu
                    </button>
                    <button type="button" onClick={onJumpToEnd} disabled={!totalPages}>
                        Cuối
                    </button>
                </div>
            </div>

            <div className="slide-list">
                {Array.from({ length: maxShown }, (_, i) => i + 1).map((num) => {
                    if (totalPages && num > totalPages) return null;
                    return (
                        <button
                            key={num}
                            type="button"
                            onClick={() => onSelectSlide(num)}
                            className={`slide-item ${num === activeSlide ? "active" : ""}`}
                            title={`Trang ${num}`}
                        >
                            <div className="slide-thumb">{num}</div>
                            <div>
                                <div className="slide-label">Trang {num}</div>
                                <small className="text-muted">Xem nhanh nội dung</small>
                            </div>
                        </button>
                    );
                })}

                {visibleSlidesCount > maxShown && (
                    <div className="slide-more">
                        ... còn {visibleSlidesCount - maxShown} trang nữa
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftSidebar;
