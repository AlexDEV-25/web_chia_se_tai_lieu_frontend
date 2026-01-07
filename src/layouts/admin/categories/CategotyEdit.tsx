import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../apis/CategoryApi";
import type { CategoryRequest } from "../../../models/request/CategoryRequest";
import axios from "axios";

const CategoryEdit: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
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
                let message = "Không tìm thấy danh mục. Vui lòng thử lại.";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.message ??
                        err.message ??
                        message;
                }
                setFormError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id, navigate]);

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
        if (!validateForm() || !id) {
            return;
        }

        setFormError(null);
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
            let message = "Không thể cập nhật danh mục. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
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

                    {formError && (
                        <div className="category-alert error">
                            <p>{formError}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="category-card">
                            <div className="category-loading-row" />
                            <div className="category-loading-row" />
                        </div>
                    ) : (
                        <form className="category-form" onSubmit={handleSubmit} noValidate>
                            <label className="form-field">
                                <span>Tên danh mục</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`category-input ${nameError ? "has-error" : ""}`}
                                    placeholder="Ví dụ: Ngôn ngữ"
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
                                        setNameError("");
                                        setFormError(null);
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