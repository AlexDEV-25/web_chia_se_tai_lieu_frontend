import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type GrindItemProps = {
    itemType: "document" | "lesson";
    link: string;
    title: string;
    thumbnailUrl?: string | null;
    subtitle?: ReactNode;
    viewsCount?: number | null;
    downloadsCount?: number | null;
    showDocTypeBadge?: boolean;
    showVideoOverlay?: boolean;
    videoDuration?: string;
    showOverlayFavorite?: boolean;
    showInlineFavorite?: boolean;
    isFavorite?: boolean;
    favoriteDisabled?: boolean;
    onToggleFavorite?: () => void;
    variant?: "default" | "compact";
    simple?: boolean;
    metaExtras?: ReactNode;
    numberFormatter?: (value?: number | null) => string;
};

const defaultNumberFormatter = (value?: number | null) => {
    if (value == null) return "0";
    return value.toLocaleString("vi-VN");
};

const GrindItem: React.FC<GrindItemProps> = ({
    itemType,
    link,
    title,
    thumbnailUrl,
    subtitle,
    viewsCount,
    downloadsCount,
    showDocTypeBadge = true,
    showVideoOverlay = false,
    videoDuration,
    showOverlayFavorite = false,
    showInlineFavorite = false,
    isFavorite = false,
    favoriteDisabled = false,
    onToggleFavorite,
    variant = "default",
    simple = false,
    metaExtras,
    numberFormatter = defaultNumberFormatter,
}: GrindItemProps) => {
    const safeThumbnailUrl =
        thumbnailUrl && thumbnailUrl.trim() !== "" ? thumbnailUrl : "/images/video-placeholder.jpg";
    const resolvedDocType = itemType === "document" ? "PDF" : "Video";
    const itemClasses = ["document-card"];

    if (variant === "compact") {
        itemClasses.push("compact");
    }

    if (simple) {
        itemClasses.push("simple");
    }

    const articleClassName = itemClasses.join(" ").trim();

    const renderThumbnail = () => {
        const content = (
            <>
                <img src={safeThumbnailUrl} alt={title} />
                {showDocTypeBadge && <span className="doc-type">{resolvedDocType}</span>}
                {showVideoOverlay && (
                    <div className="video-overlay">
                        <i className="fa fa-play-circle" />
                        {videoDuration && <span className="duration">{videoDuration}</span>}
                    </div>
                )}
            </>
        );

        return (
            <Link to={link} className="doc-thumbnail">
                {content}
            </Link>
        );
    };

    const renderTitle = () => {
        return (
            <Link to={link}>
                <h3>{title}</h3>
            </Link>
        );
    };

    const renderMeta = () => {
        const hasViews = viewsCount != null;
        const hasDownloads = itemType === "document" && downloadsCount != null;
        const hasInlineFavorite = showInlineFavorite && onToggleFavorite;
        const hasMetaExtras = Boolean(metaExtras);

        if (!hasViews && !hasDownloads && !hasInlineFavorite && !hasMetaExtras) {
            return null;
        }

        return (
            <div className="doc-meta">
                <div className="meta-left">
                    {hasViews && (
                        <span>
                            <i className="fa fa-eye me-1" /> {numberFormatter(viewsCount)}
                        </span>
                    )}
                    {hasDownloads && (
                        <span>
                            <i className="fa fa-download me-1" /> {numberFormatter(downloadsCount)}
                        </span>
                    )}
                    {metaExtras}
                </div>
                {showInlineFavorite && onToggleFavorite && (
                    <button
                        type="button"
                        className={`favorite-inline ${isFavorite ? "active" : ""}`}
                        aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                        onClick={onToggleFavorite}
                        disabled={favoriteDisabled}
                    >
                        <i className={`fa ${isFavorite ? "fa-heart" : "fa-heart-o"}`} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <article className={articleClassName}>
            {renderThumbnail()}
            <div className="doc-body">
                {renderTitle()}
                {subtitle}
                {renderMeta()}
            </div>
        </article>
    );
};

export default GrindItem;
