import { useContext, useEffect, useMemo, useState } from "react";
import { search, stats, getAllPublicLesson } from "../../../apis/LessonApi";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import type { LessonResponse } from "../../../models/response/lesson/LessonResponse";
import { AppContext } from "../../../contexts/AppContext";
import HeroBlockComp from "./components/HeroBlockComp";
import MainBlockComp from "./components/MainBlockComp";
import CategoryBlockComp from "./components/CategoryBlockComp";
import usePublicCategories from "../../../hooks/usePublicCategory";


const Lesson = () => {
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [statsData, setStatsData] = useState<any>(null);
    const [loadingLessons, setLoadingLessons] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<"all" | number>("all");
    const [showAllCategories, setShowAllCategories] = useState(false);
    const context = useContext(AppContext) as any;
    const keyWords = context.keyword ?? '';
    const { categories, loading } = usePublicCategories();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await stats();
                setStatsData(response?.result ?? null);
            } catch (err: any) {
                console.error(handleApiError(err, ERROR_MESSAGES.LESSON_LOAD_FAILED));
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchLessons = async () => {
            setLoadingLessons(true);
            try {
                const hasKeyword = keyWords.trim() !== "";
                const hasCategory = selectedCategory !== "all";

                if (!hasKeyword && !hasCategory) {
                    const response = await getAllPublicLesson();
                    setLessons(response?.resultList ?? []);
                } else {
                    const categoryId = selectedCategory === "all" ? null : (selectedCategory as number);
                    const response = await search(keyWords, categoryId);
                    setLessons(response?.resultList ?? []);
                }
            } catch (err: any) {
                setError(handleApiError(err, ERROR_MESSAGES.LESSON_LOAD_FAILED));
            } finally {
                setLoadingLessons(false);
            }
        };
        fetchLessons();
    }, [keyWords, selectedCategory]);

    const filteredLessons = useMemo(() => {
        return lessons;
    }, [lessons]);

    const topCategories = useMemo(() => categories.slice(0, 6), [categories]);
    const displayedCategories = showAllCategories ? categories : topCategories;
    const hasMoreCategories = categories.length > topCategories.length;
    const selectedCategoryLabel = selectedCategory === "all"
        ? "Trending tuần này"
        : `Danh mục: ${categories.find(cat => cat.id === selectedCategory)?.name ?? ""}`;

    const statsMetrics = useMemo(() => {
        return {
            totalLessons: statsData?.totalLessons ?? 0,
            totalViews: statsData?.totalViews ?? 0,
            totalVideos: statsData?.totalDocuments ?? 0,
        };
    }, [statsData]);

    const shimmer = Array.from({ length: 6 });

    return (
        <div className="home-shell">
            <HeroBlockComp
                content={{
                    eyebrow: "StudyShare · Video học tập",
                    title: "Học hiệu quả với <span>video bài giảng chất lượng</span>",
                    subtitle: "Hàng trăm video bài giảng từ giảng viên kinh nghiệm, kèm tài liệu chi tiết. Nâng cao kiến thức và kỹ năng của bạn ngay hôm nay."
                }}
                metrics={[
                    { label: "Video", value: statsMetrics.totalLessons, subtext: "bài giảng" },
                    { label: "Lượt xem", value: statsMetrics.totalViews.toLocaleString("vi-VN"), subtext: "đang học" },
                ]}
            />

            <CategoryBlockComp
                loading={loading}
                categories={displayedCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                showAllCategories={showAllCategories}
                hasMoreCategories={hasMoreCategories}
                onToggleShowAll={() => {
                    setShowAllCategories((prev) => !prev);
                    setSelectedCategory("all");
                }}
                shimmerPlaceholders={shimmer}
            />

            <MainBlockComp
                loading={loadingLessons}
                error={error}
                items={filteredLessons}
                onFavoriteChange={(itemId, isFavorite) => {
                    setLessons(prev =>
                        prev.map(lesson =>
                            lesson.id === itemId ? { ...lesson, favorite: isFavorite } : lesson
                        )
                    );
                }}
                shimmerPlaceholders={shimmer}
                selectedCategoryLabel={selectedCategoryLabel}
                itemType="LESSON"
                sectionTitle="Video đề xuất"
                emptyMessage="Không có video nào trong danh mục này. Hãy thử danh mục khác."
            />
        </div>
    );
};

export default Lesson;