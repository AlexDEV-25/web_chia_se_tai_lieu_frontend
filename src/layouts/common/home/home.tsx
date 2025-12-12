import { useEffect, useMemo, useState } from "react";
import { getAllDocument } from "../../../apis/DocumentApi";
import { getAllCategory } from "../../../apis/CategoryApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { CategoryResponse } from "../../../models/response/CategoryResponse";
import HeroBlock from "./components/heroBlock";
import CategoryBlock from "./components/categoryBlock";
import DocumentBlock from "./components/documentBlock";

const Home = () => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [loadingCats, setLoadingCats] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
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
            const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [documents, searchTerm, selectedCategory]);

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
            <HeroBlock
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
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

            <DocumentBlock
                loading={loadingDocs}
                error={error}
                documents={filteredDocuments}
                shimmerPlaceholders={shimmer}
                selectedCategoryLabel={selectedCategoryLabel}
            />
        </div>
    );
};

export default Home;
