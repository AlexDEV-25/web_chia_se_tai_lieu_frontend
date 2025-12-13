import type { CategoryResponse } from "../../../../models/response/CategoryResponse";

type CategoryBlockProps = {
    loading: boolean;
    categories: CategoryResponse[];
    selectedCategory: "all" | number;
    onSelectCategory: (categoryId: number) => void;
    showAllCategories: boolean;
    hasMoreCategories: boolean;
    onToggleShowAll: () => void;
    shimmerPlaceholders: unknown[];
};

const CategoryBlock = ({
    loading,
    categories,
    selectedCategory,
    onSelectCategory,
    showAllCategories,
    hasMoreCategories,
    onToggleShowAll,
    shimmerPlaceholders,
}: CategoryBlockProps) => {
    return (
        <section className="categories-block">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Danh mục nổi bật</p>
                    <h2>Chọn nhanh đúng nhóm tài liệu</h2>
                </div>
                {hasMoreCategories && (
                    <button
                        className="btn-pill primary"
                        onClick={() => {
                            onToggleShowAll();
                        }}
                    >
                        {showAllCategories ? "Thu gọn" : "Xem tất cả"}
                    </button>
                )}
            </div>

            {loading ? (
                <div className="category-grid">
                    {shimmerPlaceholders.map((_, index) => (
                        <div key={index} className="category-card shimmer" />
                    ))}
                </div>
            ) : (
                <div className="category-grid">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-card ${selectedCategory === category.id ? "active" : ""}`}
                            onClick={() => onSelectCategory(category.id)}
                        >
                            <div className="category-icon">
                                <i className="fa fa-folder-open" />
                            </div>
                            <div>
                                <h5>{category.name}</h5>
                                <p>{category.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default CategoryBlock;
