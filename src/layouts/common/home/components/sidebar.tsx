import React, { useState, useEffect } from "react";
import { Category } from "../../../../models/Category";
import { getAllCategory } from "../../../../apis/CategoryApi";

const Sidebar: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        const categories = async () => {
            const data = await getAllCategory();
            setCategories(data?.resultList ?? []);
            setLoading(false);
        }
        categories().catch(error => {
            setError(error.message);
        });
    }, [])
    if (loading) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-danger text-center mt-5">Lỗi: {error}</div>;
    return (
        <nav className="col-12 col-md-3 col-lg-2 bg-light border-end vh-100 p-3 position-sticky top-0">
            <h5 className="fw-bold mb-3">Danh mục</h5>
            <ul className="nav flex-column">

                {categories.map((cat) => (
                    !cat.hide
                    && <li className="nav-item mb-1" key={cat.id}>
                        <a
                            href="#"
                            className="nav-link text-dark"
                            title={cat.description}   // Tooltip mô tả
                        >
                            {cat.name}
                        </a>
                    </li>
                ))}

            </ul>
        </nav>
    );
};

export default Sidebar;
