import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    addFavoriteDocument,
    addFavoriteLesson,
    getDocumentFavoritesByUser,
    getLessonFavoritesByUser,
    removeDocumentFavorite,
    removeLessonFavorite,
} from "../../../apis/FavoriteApi";

import GrindItem from "./GrindItem";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";

interface BaseItem {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    viewsCount: number;
    userName?: string;
}

interface DocumentItem extends BaseItem {
    downloadsCount?: number;
}

interface LessonItem extends BaseItem {
    documentUrl?: string;
}

type MainBlockCompProps = {
    loading: boolean;
    error: string | null;
    items: (DocumentItem | LessonItem)[];
    shimmerPlaceholders: unknown[];
    selectedCategoryLabel: string;
    itemType: "document" | "lesson";
    sectionTitle?: string;
    emptyMessage?: string;
    emptyIcon?: string;
};

type FavoriteMap = Record<number, { favoriteId: number }>;

const MainBlockComp: React.FC<MainBlockCompProps> = ({
    loading,
    error,
    items,
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
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setFavoriteMap({});
            return;
        }

        const fetchFavorites = async () => {
            try {
                const map: FavoriteMap = {};
                if (itemType === "document") {
                    const favoritesResponse = await getDocumentFavoritesByUser();
                    (favoritesResponse.resultList ?? []).forEach((fav: any) => {
                        const itemId = fav.contentId;
                        if (itemId) {
                            map[itemId] = { favoriteId: fav.id };
                        }
                    });
                } else {
                    const favoritesResponse = await getLessonFavoritesByUser();
                    (favoritesResponse.resultList ?? []).forEach((fav: any) => {
                        const itemId = fav.contentId;
                        if (itemId) {
                            map[itemId] = { favoriteId: fav.id };
                        }
                    });
                }
                setFavoriteMap(map);
            } catch (err: any) {
                console.error(handleApiError(err, ERROR_MESSAGES.FAVORITES_LOAD_FAILED));
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [isAuthenticated, itemType]);

    const handleToggleFavorite = async (itemId: number) => {
        if (!isAuthenticated) {
            alert(`${ERROR_MESSAGES.LOGIN_REQUIRED_FAVORITE} ${itemType === "document" ? "tài liệu" : "bài giảng"} yêu thích.`);
            return;
        }

        const existing = favoriteMap[itemId];
        setFavoriteLoadingId(itemId);

        try {
            if (existing) {
                if (itemType === "document") {
                    await removeDocumentFavorite(existing.favoriteId);
                } else {
                    await removeLessonFavorite(existing.favoriteId);
                }

                setFavoriteMap((prev) => {
                    const { [itemId]: _removed, ...rest } = prev;
                    return rest;
                });
            } else {
                const response =
                    itemType === "document"
                        ? await addFavoriteDocument({
                            contentId: itemId,
                            type: 'DOCUMENT',
                        })
                        : await addFavoriteLesson({
                            contentId: itemId,
                            type: 'LESSON',
                        });
                const saved = response.result;
                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [itemId]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED);
            console.error(message);
            alert(message);
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const formatNumber = (value?: number | null) => {
        if (value == null) return "0";
        return value.toLocaleString("vi-VN");
    };

    const formatDuration = () => {
        return Math.floor(Math.random() * 60) + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0");
    };

    const getItemLink = (item: DocumentItem | LessonItem) => {
        return itemType === "document" ? `/document/${item.id}` : `/lesson/${item.id}`;
    };

    const resolveThumbnailUrl = (item: DocumentItem | LessonItem) => {
        if (!item.thumbnailUrl) return undefined;
        return `http://localhost:8080/api/images/thumbnail/${item.thumbnailUrl}`;
    };

    return (
        <section className="documents-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">{sectionTitle || (itemType === "document" ? "Tài liệu đề xuất" : "Video đề xuất")}</p>
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
                    <h3>Chưa có {itemType === "document" ? "tài liệu" : "video bài giảng"}</h3>
                    <p>{emptyMessage || `Không có ${itemType === "document" ? "tài liệu" : "video"} nào trong danh mục này. Hãy thử danh mục khác.`}</p>
                </div>
            ) : (
                <div className="document-grid">
                    {items.map((item) => {
                        const downloadsCount =
                            itemType === "document" && "downloadsCount" in item
                                ? item.downloadsCount ?? 0
                                : undefined;
                        const isFavorite = Boolean(favoriteMap[item.id]);
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
                                        <i>{item.description ? item.description : "Không có mô tả."}</i>
                                        <div>
                                            <strong style={{ fontWeight: 500, opacity: 0.7 }}>by:</strong>{" "}
                                            <Link to={getItemLink(item)}>{item.userName ?? "Tác giả ẩn danh"}</Link>
                                        </div>
                                    </div>
                                }
                                viewsCount={item.viewsCount}
                                downloadsCount={downloadsCount}
                                variant="default"
                                showVideoOverlay={itemType === "lesson"}
                                videoDuration={itemType === "lesson" ? formatDuration() : undefined}
                                showInlineFavorite
                                isFavorite={isFavorite}
                                favoriteDisabled={isLoadingFavorite}
                                onToggleFavorite={() => handleToggleFavorite(item.id)}
                                numberFormatter={formatNumber}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default MainBlockComp;