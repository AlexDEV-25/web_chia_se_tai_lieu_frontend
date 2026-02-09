import { useEffect, useState } from "react";
import { getAllDocumentByCategory } from "../../../apis/DocumentApi";
import { getAllLessonByCategory } from "../../../apis/LessonApi";

import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import { addFavoriteDocument, getDocumentFavoritesByUser, removeFavorite } from "../../../apis/FavoriteApi";
import { addFavoriteLesson, getLessonFavoritesByUser } from "../../../apis/FavoriteApi";
import type { FavoriteRequest } from "../../../models/request/FavoriteRequest";
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
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favoriteMap, setFavoriteMap] = useState<FavoriteMap>({});
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchByCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;
                if (type === 'document') {
                    response = await getAllDocumentByCategory(currentItemId, categoryId);
                } else {
                    response = await getAllLessonByCategory(currentItemId, categoryId);
                }
                const list = (response.resultList ?? [])
                setItems(list);
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
        if (!isAuthenticated) {
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
    }, [isAuthenticated, type]);

    const handleToggleFavorite = async (item: Item) => {
        if (!isAuthenticated) {
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
                        contentId: item.id,
                        type: 'DOCUMENT',
                    };
                    console.log(data);
                    response = await addFavoriteDocument(data);
                } else {
                    data = {
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
    const itemsPerPage = 4;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = currentIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < totalPages - 1;

    const handlePrev = () => {
        if (canGoPrev) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (canGoNext) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Reset index when items change
    useEffect(() => {
        setCurrentIndex(0);
    }, [items]);

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
                <div className="carousel-container">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="carousel-info">
                            <span className="badge bg-primary">
                                {currentIndex + 1} / {totalPages}
                            </span>
                        </div>
                        <div className="btn-group" role="group">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={handlePrev}
                                disabled={!canGoPrev}
                                aria-label="Previous"
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={handleNext}
                                disabled={!canGoNext}
                                aria-label="Next"
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div className="row g-3">
                        {currentItems.map((item) => {
                            const isFavorite = Boolean(favoriteMap[item.id]);
                            const isLoadingFavorite = favoriteLoadingId === item.id;
                            const thumbnailUrl = 'thumbnailUrl' in item && item.thumbnailUrl
                                ? `http://localhost:8080/api/images/thumbnail/${item.thumbnailUrl}`
                                : undefined;
                            const link = type === 'document' ? `/document/${item.id}` : `/lesson/${item.id}`;
                            const description = 'description' in item ? item.description : '';

                            return (
                                <div key={item.id} className="col-12 col-md-6 col-lg-3">
                                    <GrindItem
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default CarouselComp;