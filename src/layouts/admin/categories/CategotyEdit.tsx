import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../apis/CategoryApi";
import type { CategoryRequest } from "../../../models/request/CategoryRequest";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import LoadingState from "../components/LoadingState";

const CategoryEdit: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) {
                navigate("/categories");
                return;
            }
            try {
                setLoading(true);
                const response = await getCategoryById(parseInt(id, 10));
                setName(response.result?.name ?? "");
                setDescription(response.result?.description ?? "");
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.CATEGORY_NOT_FOUND);
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id) { return; }

        setError(null);
        setIsSubmitting(true);

        try {
            const updatedCategory: CategoryRequest = {
                name: name.trim(),
                description: description.trim(),
                hide: false
            };
            await updateCategory(parseInt(id, 10), updatedCategory);
            navigate("/categories");
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CATEGORY_UPDATE_FAILED);
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
                            <h1>Chỉnh sửa danh mục</h1>
                            <p>Điều chỉnh thông tin chuyên mục để dữ liệu luôn chính xác.</p>
                        </div>
                        <button
                            type="button"
                            className="category-btn ghost"
                            onClick={() => navigate("/categories")}
                        >
                            Quay lại
                        </button>
                    </div>

                    {loading ? (
                        <LoadingState rows={2} variant="card" />
                    ) : (
                        <form className="category-form" onSubmit={handleSubmit} noValidate>
                            <label className="form-field">
                                <span>Tên danh mục</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`category-input ${error ? "has-error" : ""}`}
                                    placeholder="Ví dụ: Ngôn ngữ"
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
                                    placeholder="Mô tả ngắn để phân biệt với các danh mục khác."
                                />
                            </label>

                            <div className="category-form-actions">
                                <button
                                    type="submit"
                                    className="category-btn primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
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
                                    Đặt lại
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryEdit;