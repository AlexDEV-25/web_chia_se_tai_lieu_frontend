import { useEffect, useState } from "react";
import { getAllDocumentByCategory } from "../../../apis/DocumentApi";
import { getAllLessonByCategory } from "../../../apis/LessonApi";

import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import { addFavoriteDocument, getDocumentFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import { addFavoriteLesson, getLessonFavoritesByUser } from "../../../apis/FavoriteApi";
import { getMyInfo } from "../../../apis/UserApi";
import GrindItem from "./GrindItem";

interface CarouselProps {
    categoryId: number;
    currentItemId: number;
    type: 'document' | 'lesson';
}

type Item = DocumentResponse | LessonResponse;
type FavoriteMap = Record<number, { favoriteId: number }>;

const CarouselComp: React.FC<CarouselProps> = ({ categoryId, currentItemId, type }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;
                if (type === 'document') {
                    response = await getAllDocumentByCategory(categoryId);
                } else {
                    response = await getAllLessonByCategory(categoryId);
                }

                const list = (response.resultList ?? []).filter(
                    (item: Item) => item.id !== currentItemId && item.status === "PUBLISHED"
                );
                setItems(list.slice(0, 8));
            } catch (err) {
                console.error("Carousel error", err);
                setError(`Không thể tải ${type === 'document' ? 'tài liệu' : 'bài giảng'} cùng danh mục.`);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchByCategory();
        }
    }, [categoryId, currentItemId, type]);

    useEffect(() => {
        if (!token) {
            setCurrentUserId(null);
            setFavoriteMap({});
            return;
        }

        const fetchFavorites = async () => {
            try {
                const user = await getMyInfo();
                const fetchedUserId = user?.result?.id ?? null;
                setCurrentUserId(fetchedUserId);
                if (!fetchedUserId) {
                    setFavoriteMap({});
                    return;
                }

                let favoritesResponse;
                if (type === 'document') {
                    favoritesResponse = await getDocumentFavoritesByUser();
                } else {
                    favoritesResponse = await getLessonFavoritesByUser();
                }

                const map: FavoriteMap = {};
                (favoritesResponse.resultList ?? []).forEach((fav: any) => {
                    const itemId = type === 'document' ? fav.documentId : fav.lessonId;
                    if (itemId) {
                        map[itemId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err) {
                console.error("Không thể tải kho lưu", err);
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [token, type]);

    const handleToggleFavorite = async (item: Item) => {
        if (!currentUserId) {
            alert(`Vui lòng đăng nhập để lưu ${type === 'document' ? 'tài liệu' : 'bài giảng'} yêu thích.`);
            return;
        }

        const existing = favoriteMap[item.id];
        setFavoriteLoadingId(item.id);

        try {
            if (existing) {
                await removeFavorite(existing.favoriteId);
                setFavoriteMap((prev) => {
                    const { [item.id]: _removed, ...rest } = prev;
                    return rest;
                });
            } else {
                let response;
                if (type === 'document') {
                    response = await addFavoriteDocument({
                        userId: currentUserId,
                        documentId: item.id,
                    });
                } else {
                    response = await addFavoriteLesson({
                        userId: currentUserId,
                        lessonId: item.id,
                    });
                }

                const saved = response.result;
                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [item.id]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err) {
            console.error("Favorite toggle error", err);
            alert("Không thể cập nhật kho lưu. Vui lòng thử lại.");
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const hasItems = items.length > 0;

    if (!categoryId) return null;

    return (
        <section className="documents-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Đề xuất thêm</p>
                    <h2>{type === 'document' ? 'Tài liệu' : 'Bài giảng'} cùng danh mục</h2>
                </div>
            </div>

            {loading && <div className="empty-state">Đang tải...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !hasItems && (
                <div className="empty-state">Chưa có {type === 'document' ? 'tài liệu' : 'bài giảng'} phù hợp.</div>
            )}

            {hasItems && (
                <div className="document-grid">
                    {items.map((item) => {
                        const isFavorite = Boolean(favoriteMap[item.id]);
                        const isLoadingFavorite = favoriteLoadingId === item.id;
                        const thumbnailUrl = 'thumbnailUrl' in item && item.thumbnailUrl
                            ? `http://localhost:8080/api/images/thumbnail/${item.thumbnailUrl}`
                            : undefined;
                        const link = type === 'document' ? `/document/${item.id}` : `/lesson/${item.id}`;
                        const description = 'description' in item ? item.description : '';

                        return (
                            <GrindItem
                                key={item.id}
                                itemType={type}
                                link={link}
                                title={item.title}
                                thumbnailUrl={thumbnailUrl}
                                subtitle={<p>{description ?? `${type === 'document' ? 'Tài liệu' : 'Bài giảng'} chưa có mô tả.`}</p>}
                                viewsCount={item.viewsCount}
                                downloadsCount={'downloadsCount' in item ? item.downloadsCount : undefined}
                                showInlineFavorite
                                isFavorite={isFavorite}
                                favoriteDisabled={isLoadingFavorite}
                                onToggleFavorite={() => handleToggleFavorite(item)}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default CarouselComp;