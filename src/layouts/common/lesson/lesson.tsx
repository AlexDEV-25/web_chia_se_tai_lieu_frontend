import { useEffect, useMemo, useState } from "react";
import { getAllLesson } from "../../../apis/LessonApi";
import { getAllCategory } from "../../../apis/CategoryApi";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import type { CategoryResponse } from "../../../models/response/CategoryResponse";
import LessonHeroBlock from "./components/lessonHeroBlock";
import CategoryBlock from "../home/components/categoryBlock";
import LessonBlock from "./components/lessonBlock";

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
                const data = await getAllLesson();
                setLessons(data?.resultList ?? []);
            } catch (err) {
                setError("Không thể tải video bài giảng. Vui lòng thử lại.");
            } finally {
                setLoadingLessons(false);
            }
        };
        fetchLessons();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategory();
                setCategories((data?.resultList ?? []).filter(cat => !cat.hide));
            } catch (err) {
                setError("Không thể tải danh mục. Vui lòng thử lại.");
            } finally {
                setLoadingCats(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredLessons = useMemo(() => {
        return lessons.filter(lesson => {
            if (lesson.status && lesson.status !== "PUBLISHED" && lesson.hide !== false) {
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
            <LessonHeroBlock
                stats={stats}
            />

            <CategoryBlock
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

            <LessonBlock
                loading={loadingLessons}
                error={error}
                lessons={filteredLessons}
                shimmerPlaceholders={shimmer}
                selectedCategoryLabel={selectedCategoryLabel}
            />
        </div>
    );
};

export default Lesson;