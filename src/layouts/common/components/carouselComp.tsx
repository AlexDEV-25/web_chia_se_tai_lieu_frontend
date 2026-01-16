import { useEffect, useState, useContext } from "react";
import { getAllDocumentByCategory } from "../../../apis/DocumentApi";
import { getAllLessonByCategory } from "../../../apis/LessonApi";

import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import { addFavoriteDocument, getDocumentFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import { addFavoriteLesson, getLessonFavoritesByUser } from "../../../apis/FavoriteApi";
import type { FavoriteRequest } from "../../../models/request/FavoriteRequest";
import { UserContext } from "../../../AppContext";
import GrindItem from "./GrindItem";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";

interface CarouselProps {
    categoryId: number;
    currentItemId: number;
    type: 'document' | 'lesson';
}

type Item = DocumentResponse | LessonResponse;
type FavoriteMap = Record<number, { favoriteId: number }>;

const CarouselComp: React.FC<CarouselProps> = ({ categoryId, currentItemId, type }) => {
    const userCtx = useContext(UserContext);
    const currentUser = userCtx?.currentUser;
    const currentUserId = currentUser?.id ?? null;

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);

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
            } catch (err: any) {
                setError(handleApiError(err, ERROR_MESSAGES.CAROUSEL_LOAD_FAILED));
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchByCategory();
        }
    }, [categoryId, currentItemId, type]);

    useEffect(() => {
        if (!currentUserId) {
            setFavoriteMap({});
            return;
        }

        const fetchFavorites = async () => {
            try {
                let favoritesResponse;
                if (type === 'document') {
                    favoritesResponse = await getDocumentFavoritesByUser();
                } else {
                    favoritesResponse = await getLessonFavoritesByUser();
                }

                const map: FavoriteMap = {};
                (favoritesResponse.resultList ?? []).forEach((fav: any) => {
                    const itemId = fav.contentId;
                    if (itemId) {
                        map[itemId] = { favoriteId: fav.id };
                    }
                });
                setFavoriteMap(map);
            } catch (err: any) {
                console.error(handleApiError(err, ERROR_MESSAGES.FAVORITES_LOAD_FAILED));
                setFavoriteMap({});
            }
        };

        fetchFavorites();
    }, [currentUserId, type]);

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
                let data: FavoriteRequest;
                if (type === 'document') {
                    data = {
                        userId: currentUserId,
                        contentId: item.id,
                        type: 'DOCUMENT',
                    };
                    console.log(data);
                    response = await addFavoriteDocument(data);
                } else {
                    data = {
                        userId: currentUserId,
                        contentId: item.id,
                        type: 'LESSON',
                    };
                    response = await addFavoriteLesson(data);
                }

                const saved = response.result;

                if (saved) {
                    setFavoriteMap((prev) => ({
                        ...prev,
                        [item.id]: { favoriteId: saved.id },
                    }));
                }
            }
        } catch (err: any) {
            alert(handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED));
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