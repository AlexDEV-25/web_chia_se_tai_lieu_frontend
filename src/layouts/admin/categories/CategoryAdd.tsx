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
    const [nameError, setNameError] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validateForm = () => {
        let isValid = true;
        let localNameError = "";

        if (name.trim() === "") {
            localNameError = "Vui lòng nhập tên danh mục.";
            isValid = false;
        }

        setNameError(localNameError);
        return isValid;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        setFormError(null);
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
            setFormError(message);
        } finally {
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

                    {formError && (
                        <div className="category-alert error">
                            <p>{formError}</p>
                        </div>
                    )}

                    <form className="category-form" onSubmit={handleSubmit} noValidate>
                        <label className="form-field">
                            <span>Tên danh mục</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`category-input ${nameError ? "has-error" : ""}`}
                                placeholder="Ví dụ: Công nghệ thông tin"
                            />
                            {nameError && <small className="field-error">{nameError}</small>}
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
                                    setNameError("");
                                    setFormError(null);
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