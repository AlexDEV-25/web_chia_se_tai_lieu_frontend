import { useEffect, useMemo, useState } from "react";
import { getAllLesson } from "../../../apis/LessonApi";
import { getAllCategory } from "../../../apis/CategoryApi";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import type { CategoryResponse } from "../../../models/response/CategoryResponse";
import HeroBlockComp from "../components/HeroBlockComp";
import CategoryBlockComp from "../components/CategoryBlockComp";
import MainBlockComp from "../components/MainBlockComp";
import axios from "axios";

interface Props {
    keyWords: string
}

const Lesson = ({ keyWords }: Props) => {
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingLessons, setLoadingLessons] = useState(true);
    const [loadingCats, setLoadingCats] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<"all" | number>("all");
    const [showAllCategories, setShowAllCategories] = useState(false);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await getAllLesson();
                setLessons(response?.resultList ?? []);
            } catch (err: any) {
                let message = "Không thể tải bài giảng. Vui lòng thử lại.";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.message ??
                        err.message ??
                        message;
                }
                setError(message);
            } finally {
                setLoadingLessons(false);
            }
        };
        fetchLessons();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategory();
                setCategories((response?.resultList ?? []).filter(cat => !cat.hide));
            } catch (err: any) {
                let message = "Không thể tải danh mục. Vui lòng thử lại.";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.message ??
                        err.message ??
                        message;
                }
                setError(message);
            } finally {
                setLoadingCats(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredLessons = useMemo(() => {
        return lessons.filter(lesson => {
            if ((lesson.status && lesson.status !== "PUBLISHED") || (lesson.hide !== false)) {
                return false;
            }
            const matchCategory = selectedCategory === "all" || lesson.categoryId === selectedCategory;
            const matchSearch = lesson.title.toLowerCase().includes(keyWords.toLowerCase()) ||
                lesson.description.toLowerCase().includes(keyWords.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [lessons, keyWords, selectedCategory]);

    const topCategories = useMemo(() => categories.slice(0, 6), [categories]);
    const displayedCategories = showAllCategories ? categories : topCategories;
    const hasMoreCategories = categories.length > topCategories.length;
    const selectedCategoryLabel = selectedCategory === "all"
        ? "Trending tuần này"
        : `Danh mục: ${categories.find(cat => cat.id === selectedCategory)?.name ?? ""}`;

    const stats = useMemo(() => {
        const totalViews = lessons.reduce((sum, lesson) => sum + (lesson.viewsCount ?? 0), 0);
        const totalVideos = lessons.filter(lesson => lesson.documentUrl).length;
        return {
            totalLessons: lessons.length,
            totalViews,
            totalVideos,
        };
    }, [lessons]);

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
                    {
                        label: "Video",
                        value: stats.totalLessons,
                        subtext: "bài giảng"
                    },
                    {
                        label: "Lượt xem",
                        value: stats.totalViews.toLocaleString("vi-VN"),
                        subtext: "đang học"
                    },
                    {
                        label: "Tài liệu",
                        value: stats.totalVideos,
                        subtext: "đã sẵn sàng"
                    }
                ]}
            />

            <CategoryBlockComp
                loading={loadingCats}
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
                shimmerPlaceholders={shimmer}
                selectedCategoryLabel={selectedCategoryLabel}
                itemType="lesson"
                sectionTitle="Video đề xuất"
                emptyMessage="Không có video nào trong danh mục này. Hãy thử danh mục khác."
            />
        </div>
    );
};

export default Lesson;