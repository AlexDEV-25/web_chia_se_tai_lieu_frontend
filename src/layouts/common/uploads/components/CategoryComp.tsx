import usePublicCategories from "../../../../hooks/usePublicCategory";

interface Props {
    categoryId: number;
    setCategoryId: (id: number) => void;
}

const CategoryComp: React.FC<Props> = ({ categoryId, setCategoryId }) => {
    const { categories } = usePublicCategories();
    return (
        <>
            <div className="input-field">
                <label>Danh mục</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                    <option key="-1" value="-1">Danh mục khác</option>
                </select>
            </div>
        </>
    );
}
export default CategoryComp;