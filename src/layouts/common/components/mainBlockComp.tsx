import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FavoriteDocumentResponse } from "../../../models/response/FavoriteDocumentResponse";
import type { FavoriteLessonResponse } from "../../../models/response/FavoriteLessonResponse";
import {
    addFavoriteDocument,
    addFavoriteLesson,
    getDocumentFavoritesByUser,
    getLessonFavoritesByUser,
    removeFavorite,
} from "../../../apis/FavoriteApi";

import { getMyInfo } from "../../../apis/UserApi";
import GrindItem from "./GrindItem";
import axios from "axios";

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
    const hasItems = items.length > 0;
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setCurrentUserId(null);
            setFavoriteMap({});
            return;
        }

        const fetchUserAndFavorites = async () => {
            try {
                const userResponse = await getMyInfo();
                const fetchedUserId = userResponse?.result?.id ?? null;
                setCurrentUserId(fetchedUserId);

                if (!fetchedUserId) {
                    setFavoriteMap({});
                    return;
                }

                const map: FavoriteMap = {};
                if (itemType === "document") {
                    const favoritesResponse = await getDocumentFavoritesByUser();
                    (favoritesResponse.resultList ?? []).forEach((fav: FavoriteDocumentResponse) => {
                        if (fav.documentId) {
                            map[fav.documentId] = { favoriteId: fav.id };
                        }
                    });
                } else {
                    const favoritesResponse = await getLessonFavoritesByUser();
                    (favoritesResponse.resultList ?? []).forEach((fav: FavoriteLessonResponse) => {
                        if (fav.lessonId) {
                            map[fav.lessonId] = { favoriteId: fav.id };
                        }
                    });
                }
                setFavoriteMap(map);
            } catch (err: any) {
                let message = "Không thể tải dữ liệu người dùng hoặc kho yêu thích. Vui lòng thử lại.";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.message ??
                        err.message ??
                        message;
                }
                console.error(message);
                setFavoriteMap({});
            }
        };

        fetchUserAndFavorites();
    }, [token, itemType]);

    const handleToggleFavorite = async (itemId: number) => {
        if (!currentUserId) {
            alert(`Vui lòng đăng nhập để lưu ${itemType === "document" ? "tài liệu" : "bài giảng"} yêu thích.`);
            return;
        }

        const existing = favoriteMap[itemId];
        setFavoriteLoadingId(itemId);

        try {
            if (existing) {
                await removeFavorite(existing.favoriteId);

                setFavoriteMap((prev) => {
                    const { [itemId]: _removed, ...rest } = prev;
                    return rest;
                });
            } else {
                const response =
                    itemType === "document"
                        ? await addFavoriteDocument({
                            userId: currentUserId,
                            documentId: itemId,
                        })
                        : await addFavoriteLesson({
                            userId: currentUserId,
                            lessonId: itemId,
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
            let message = "Không thể cập nhật kho yêu thích. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
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