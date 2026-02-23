export const renderStatusPill = (isHidden: boolean) => (
    <span className={`category-status-pill ${isHidden ? 'is-hidden' : 'is-visible'}`}>
        {isHidden ? 'Đang ẩn' : 'Đang hiển thị'}
    </span>
);