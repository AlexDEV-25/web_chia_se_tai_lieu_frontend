import { useEffect, useMemo, useState } from "react";
import { search, stats, getAllPublicDocument } from "../../../apis/DocumentApi";
import { getAllPublicCategory } from "../../../apis/CategoryApi";
import type { CategoryResponse } from "../../../models/response/category/CategoryResponse";
import HeroBlockComp from "../components/HeroBlockComp1";
import CategoryBlockComp from "../components/CategoryBlockComp1";
import MainBlockComp from "../components/MainBlockComp1";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import type { DocumentFavoriteResponse } from "../../../models/response/document/DocumentFavoriteResponse";
interface Props {
    keyWords: string
}
const Home = ({ keyWords }: Props) => {
    const [documents, setDocuments] = useState<DocumentFavoriteResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [statsData, setStatsData] = useState<any>(null);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [loadingCats, setLoadingCats] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<"all" | number>("all");
    const [showAllCategories, setShowAllCategories] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await stats();
                setStatsData(response?.result ?? null);
            } catch (err: any) {
                console.error(handleApiError(err, ERROR_MESSAGES.DOCUMENT_LOAD_FAILED));
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoadingDocs(true);
            try {
                console.log(keyWords);
                const hasKeyword = keyWords.trim() !== "";
                const hasCategory = selectedCategory !== "all";

                if (!hasKeyword && !hasCategory) {
                    const response = await getAllPublicDocument();
                    setDocuments(response?.resultList ?? []);
                } else {
                    const categoryId = selectedCategory === "all" ? null : (selectedCategory as number);
                    const response = await search(keyWords, categoryId);
                    console.log(keyWords, categoryId, response);
                    setDocuments(response?.resultList ?? []);
                }
            } catch (err: any) {
                setError(handleApiError(err, ERROR_MESSAGES.DOCUMENT_LOAD_FAILED));
            } finally {
                setLoadingDocs(false);
            }
        };
        fetchDocuments();
    }, [keyWords, selectedCategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllPublicCategory();
                setCategories((response?.resultList ?? []));
            } catch (err: any) {
                setError(handleApiError(err, ERROR_MESSAGES.CATEGORY_LOAD_FAILED));
            } finally {
                setLoadingCats(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredDocuments = useMemo(() => {
        return documents;
    }, [documents]);

    const topCategories: CategoryResponse[] = useMemo(() => categories.slice(0, 6), [categories]);
    const displayedCategories: CategoryResponse[] = showAllCategories ? categories : topCategories;
    const hasMoreCategories: boolean = categories.length > topCategories.length;
    const selectedCategoryLabel: string = selectedCategory === "all"
        ? "Trending tuần này"
        : `Danh mục: ${categories.find(cat => cat.id === selectedCategory)?.name ?? ""}`;

    const statsMetrics = useMemo(() => {
        return {
            totalDocuments: statsData?.totalDocuments ?? 0,
            totalDownloads: statsData?.totalDownloads ?? 0,
            totalViews: statsData?.totalViews ?? 0,
        };
    }, [statsData]);

    const shimmer = Array.from({ length: 6 });

    return (
        <div className="home-shell">
            <HeroBlockComp
                content={{
                    eyebrow: "StudyShare · Kho chia sẻ học tập",
                    title: "Đón đầu kỳ thi cùng bộ <span>tài liệu chuẩn hóa</span>",
                    subtitle: "Hàng trăm tài liệu mới được cập nhật mỗi tuần, phân loại rõ ràng theo học phần & kỹ năng. Khám phá ngay hôm nay để bắt kịp tiến độ học tập của bạn."
                }}
                metrics={[
                    {
                        label: "Tài liệu",
                        value: statsMetrics.totalDocuments,
                        subtext: "đã sẵn sàng"
                    },
                    {
                        label: "Lượt tải",
                        value: statsMetrics.totalDownloads.toLocaleString("vi-VN"),
                        subtext: "từ cộng đồng"
                    },
                    {
                        label: "Lượt xem",
                        value: statsMetrics.totalViews.toLocaleString("vi-VN"),
                        subtext: "đang học"
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
                loading={loadingDocs}
                error={error}
                items={filteredDocuments}
                shimmerPlaceholders={shimmer}
                selectedCategoryLabel={selectedCategoryLabel}
                itemType="document"
                sectionTitle="Tài liệu đề xuất"
                emptyMessage="Không tìm thấy tài liệu phù hợp. Hãy thử từ khóa khác nhé!"
            />
        </div>
    );
};

export default Home;
