import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../apis/CategoryApi";
import type { CategoryRequest } from "../../../models/request/CategoryRequest";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";

const CategoryAdd: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError(null);
        setIsSubmitting(true);

        try {
            const newCategory: CategoryRequest = {
                name: name.trim(),
                description: description.trim(),
                hide: false
            };
            await createCategory(newCategory);
            navigate("/categories");
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CREATE_FAILED);
            setError(message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-category-page">
            <div className="category-container narrow">
                <div className="category-form-card">
                    <div className="category-form-header">
                        <div>
                            <p className="category-eyebrow">Quản lý danh mục</p>
                            <h1>Thêm danh mục mới</h1>
                            <p>Tạo chuyên mục để sắp xếp tài liệu và bài giảng khoa học hơn.</p>
                        </div>
                        <button
                            type="button"
                            className="category-btn ghost"
                            onClick={() => navigate("/categories")}
                        >
                            Quay lại
                        </button>
                    </div>

                    <form className="category-form" onSubmit={handleSubmit} noValidate>
                        <label className="form-field">
                            <span>Tên danh mục</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`category-input ${error ? "has-error" : ""}`}
                                placeholder="Ví dụ: Công nghệ thông tin"
                            />
                            {error && <small className="field-error">{error}</small>}
                        </label>

                        <label className="form-field">
                            <span>Mô tả</span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="category-textarea"
                                rows={5}
                                placeholder="Ghi chú ngắn giúp người dùng hiểu nội dung danh mục."
                            />
                        </label>

                        <div className="category-form-actions">
                            <button
                                type="submit"
                                className="category-btn primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang lưu..." : "Thêm danh mục"}
                            </button>
                            <button
                                type="button"
                                className="category-btn subtle"
                                onClick={() => {
                                    setName("");
                                    setDescription("");
                                    setError(null);
                                }}
                            >
                                Xóa nội dung
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryAdd;