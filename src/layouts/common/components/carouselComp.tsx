import { useEffect, useState } from "react";
import { getAllDocumentByCategory } from "../../../apis/DocumentApi";
import { getAllLessonByCategory } from "../../../apis/LessonApi";
import { addFavoriteDocument, removeDocumentFavorite, addFavoriteLesson, removeLessonFavorite } from "../../../apis/FavoriteApi";
import type { FavoriteRequest } from "../../../models/request/FavoriteRequest";
import GrindItem from "./GrindItem";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import type { DocumentFavoriteResponse } from "../../../models/response/DocumentFavoriteResponse";
import type { LessonFavoriteResponse } from "../../../models/response/LessonFavoriteResponse";

interface CarouselProps {
    categoryId: number;
    currentItemId: number;
    type: 'document' | 'lesson';
}

type Item = DocumentFavoriteResponse | LessonFavoriteResponse;

const CarouselComp: React.FC<CarouselProps> = ({ categoryId, currentItemId, type }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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



    const handleToggleFavorite = async (item: Item) => {
        if (!isAuthenticated) {
            alert(`Vui lòng đăng nhập để lưu ${type === 'document' ? 'tài liệu' : 'bài giảng'} yêu thích.`);
            return;
        }

        setFavoriteLoadingId(item.id);

        try {
            if (item.favorite === true) {
                if (type === 'document') {
                    await removeDocumentFavorite(item.id);
                } else {
                    await removeLessonFavorite(item.id);
                }
                setItems((prev) =>
                    prev.map((i) =>
                        i.id === item.id ? { ...i, favorite: false } : i
                    )
                );
            } else {
                let data: FavoriteRequest;
                if (type === 'document') {
                    data = {
                        contentId: item.id,
                        type: 'DOCUMENT',
                    };
                    await addFavoriteDocument(data);
                } else {
                    data = {
                        contentId: item.id,
                        type: 'LESSON',
                    };
                    await addFavoriteLesson(data);
                }

                setItems((prev) =>
                    prev.map((i) =>
                        i.id === item.id ? { ...i, favorite: true } : i
                    )
                );
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
                                        isFavorite={item.favorite}
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