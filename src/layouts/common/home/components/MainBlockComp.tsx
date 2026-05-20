import { Link } from "react-router-dom";
import { useState } from "react";
import { addFavorite, removeDocumentFavorite, removeLessonFavorite } from "../../../../apis/FavoriteApi";
import { handleApiError } from "../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../constants/messages";
import AlertDialog from "../../components/AlertDialog";
import type { InteractionType } from "../../../../models/enum/common";
import GrindItem from "../../components/GrindItem";

interface BaseItem {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    username: string;
    viewsCount: number;
    favorite: boolean;
}

interface DocumentItem extends BaseItem {
    downloadsCount: number;
}

interface LessonItem extends BaseItem {
    documentUrl?: string;
}

type MainBlockCompProps = {
    loading: boolean;
    error: string | null;
    items: (DocumentItem | LessonItem)[];
    onFavoriteChange?: (itemId: number, isFavorite: boolean) => void;
    shimmerPlaceholders: unknown[];
    selectedCategoryLabel: string;
    itemType: InteractionType;
    sectionTitle?: string;
    emptyMessage?: string;
    emptyIcon?: string;
};

const MainBlockComp: React.FC<MainBlockCompProps> = ({
    loading,
    error,
    items,
    onFavoriteChange,
    shimmerPlaceholders,
    selectedCategoryLabel,
    itemType,
    sectionTitle,
    emptyMessage,
    emptyIcon,
}: MainBlockCompProps) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const hasItems = items.length > 0;
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '' });

    const handleCloseAlert = () => setAlertDialog({ isOpen: false, title: '', message: '' });

    const handleToggleFavorite = async (itemId: number, currentFavorite: boolean) => {
        if (!isAuthenticated) {
            setAlertDialog({
                isOpen: true,
                title: 'Yêu cầu đăng nhập',
                message: `${ERROR_MESSAGES.LOGIN_REQUIRED_FAVORITE} ${itemType === "DOCUMENT" ? "tài liệu" : "bài giảng"} yêu thích.`
            });
            return;
        }

        setFavoriteLoadingId(itemId);

        try {
            if (currentFavorite) {
                if (itemType === "DOCUMENT") {
                    await removeDocumentFavorite(itemId);
                } else {
                    await removeLessonFavorite(itemId);
                }
            } else {
                await addFavorite({
                    contentId: itemId,
                    type: itemType,
                });
            }

            onFavoriteChange?.(itemId, !currentFavorite);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED);
            console.error(message);
            setAlertDialog({
                isOpen: true,
                title: 'Lỗi cập nhật',
                message: message
            });
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const formatNumber = (value?: number | null) => {
        if (value == null) return "0";
        return value.toLocaleString("vi-VN");
    };

    const truncate = (str: string, maxLength: number) => {
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength) + "...";
    };

    const formatDuration = () => {
        return Math.floor(Math.random() * 60) + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0");
    };

    const getItemLink = (item: DocumentItem | LessonItem) => {
        return itemType === "DOCUMENT" ? `/document/${item.id}` : `/lesson/${item.id}`;
    };

    const resolveThumbnailUrl = (item: DocumentItem | LessonItem) => {
        if (!item.thumbnailUrl) return undefined;
        return `${item.thumbnailUrl}`;
    };

    return (
        <section className="documents-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">{sectionTitle || (itemType === "DOCUMENT" ? "Tài liệu đề xuất" : "Video đề xuất")}</p>
                    <h2>{selectedCategoryLabel}</h2>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="document-grid">
                    {shimmerPlaceholders.map((_, index) => (
                        <div key={index} className="document-card shimmer" />
                    ))}
                </div>
            ) : !hasItems ? (
                <div className="empty-state">
                    {emptyIcon && <i className={`fa ${emptyIcon}`} />}
                    <h3>Chưa có {itemType === "DOCUMENT" ? "tài liệu" : "video bài giảng"}</h3>
                    <p>{emptyMessage || `Không có ${itemType === "DOCUMENT" ? "tài liệu" : "video"} nào trong danh mục này. Hãy thử danh mục khác.`}</p>
                </div>
            ) : (
                <div className="document-grid">
                    {items.map((item: DocumentItem | LessonItem) => {
                        const downloadsCount =
                            itemType === "DOCUMENT" && "downloadsCount" in item
                                ? item.downloadsCount ?? 0
                                : undefined;
                        const isFavorite = item.favorite;
                        const isLoadingFavorite = favoriteLoadingId === item.id;

                        return (
                            <GrindItem
                                key={item.id}
                                itemType={itemType}
                                link={getItemLink(item)}
                                title={item.title}
                                thumbnailUrl={resolveThumbnailUrl(item)}
                                subtitle={
                                    <div>
                                        <i>{item.description ? truncate(item.description, 30) : "Không có mô tả."}</i>
                                        <div>
                                            <strong style={{ fontWeight: 500, opacity: 0.7 }}>by:</strong>{" "}
                                            <Link to={getItemLink(item)}>{item.username ? truncate(item.username, 15) : "Tác giả ẩn danh"}</Link>
                                        </div>
                                    </div>
                                }
                                viewsCount={item.viewsCount}
                                downloadsCount={downloadsCount}
                                variant="default"
                                showVideoOverlay={itemType === "LESSON"}
                                videoDuration={itemType === "LESSON" ? formatDuration() : undefined}
                                showInlineFavorite
                                isFavorite={isFavorite}
                                favoriteDisabled={isLoadingFavorite}
                                onToggleFavorite={() => handleToggleFavorite(item.id, isFavorite)}
                                numberFormatter={formatNumber}
                            />
                        );
                    })}
                </div>
            )}
            <AlertDialog
                isOpen={alertDialog.isOpen}
                title={alertDialog.title}
                message={alertDialog.message}
                onClose={handleCloseAlert}
            />
        </section>
    );
};

export default MainBlockComp;