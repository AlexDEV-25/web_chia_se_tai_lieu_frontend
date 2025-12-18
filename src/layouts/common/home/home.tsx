import { useEffect, useMemo, useState } from "react";
import { getAllDocument } from "../../../apis/DocumentApi";
import { getAllCategory } from "../../../apis/CategoryApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { CategoryResponse } from "../../../models/response/CategoryResponse";
import HeroBlockComp from "../components/heroBlockComp";
import CategoryBlockComp from "../components/categoryBlockComp";
import MainBlockComp from "../components/mainBlockComp";
interface Props {
    keyWords: string
}
const Home = ({ keyWords }: Props) => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [loadingCats, setLoadingCats] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<"all" | number>("all");
    const [showAllCategories, setShowAllCategories] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await getAllDocument();
                setDocuments(data?.resultList ?? []);
            } catch (err) {
                setError("Không thể tải tài liệu. Vui lòng thử lại.");
            } finally {
                setLoadingDocs(false);
            }
        };
        fetchDocuments();
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

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            if (doc.status && doc.status !== "PUBLISHED" && doc.hide !== false) {
                return false;
            }
            const matchCategory = selectedCategory === "all" || doc.categoryId === selectedCategory;
            const matchSearch = doc.title.toLowerCase().includes(keyWords.toLowerCase()) ||
                doc.description.toLowerCase().includes(keyWords.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [documents, keyWords, selectedCategory]);

    const topCategories = useMemo(() => categories.slice(0, 6), [categories]);
    const displayedCategories = showAllCategories ? categories : topCategories;
    const hasMoreCategories = categories.length > topCategories.length;
    const selectedCategoryLabel = selectedCategory === "all"
        ? "Trending tuần này"
        : `Danh mục: ${categories.find(cat => cat.id === selectedCategory)?.name ?? ""}`;

    const stats = useMemo(() => {
        const totalDownloads = documents.reduce((sum, doc) => sum + (doc.downloadsCount ?? 0), 0);
        const totalViews = documents.reduce((sum, doc) => sum + (doc.viewsCount ?? 0), 0);
        return {
            totalDocuments: documents.length,
            totalDownloads,
            totalViews,
        };
    }, [documents]);

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
                        value: stats.totalDocuments,
                        subtext: "đã sẵn sàng"
                    },
                    {
                        label: "Lượt tải",
                        value: stats.totalDownloads.toLocaleString("vi-VN"),
                        subtext: "từ cộng đồng"
                    },
                    {
                        label: "Lượt xem",
                        value: stats.totalViews.toLocaleString("vi-VN"),
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
