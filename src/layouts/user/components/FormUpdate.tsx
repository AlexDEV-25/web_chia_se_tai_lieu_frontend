import { useState, useEffect, useCallback } from "react";
import type { DocumentRequest } from "../../../models/request/DocumentRequest";
import type { LessonRequest } from "../../../models/request/LessonRequest";
import type { DocumentDetailResponse } from "../../../models/response/document/DocumentDetailResponse";
import type { LessonDetailResponse } from "../../../models/response/lesson/LessonDetailResponse";
import type { CategoryResponse } from "../../../models/response/category/CategoryResponse";
import { getAllPublicCategory } from "../../../apis/CategoryApi";

import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import type { InteractionType } from "../../../models/enum/common";
import { getDetailMyDocument } from "../../../apis/DocumentApi";
import { getDetailMyLesson } from "../../../apis/LessonApi";


export type FormDataType = DocumentRequest | LessonRequest;

interface Props {
    itemId: number;
    itemType: InteractionType;
    isVisible: boolean;
    onClose: () => void;
    onSave: (data: FormDataType) => Promise<void>;
}

const FormUpdate: React.FC<Props> = ({ itemId, itemType, isVisible, onClose, onSave }) => {
    const [formData, setFormData] = useState<FormDataType>({
        title: "",
        description: "",
        categoryId: null,
        hide: false,
        status: "PENDING",
    });

    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchItemData = useCallback(async () => {
        if (!itemId) return;

        setIsLoadingData(true);
        try {
            let data: DocumentDetailResponse | LessonDetailResponse;
            if (itemType === "DOCUMENT") {
                const response = await getDetailMyDocument(itemId);
                data = response.result!;
            } else {
                const response = await getDetailMyLesson(itemId);
                data = response.result!;
            }

            setFormData({
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                hide: data.hide,
                status: data.status,
            });
        } catch (err: any) {
            const message = handleApiError(err, itemType === "DOCUMENT" ? ERROR_MESSAGES.DOCUMENT_LOAD_FAILED : ERROR_MESSAGES.LESSON_LOAD_FAILED);
            setErrors({ submit: message });
        } finally {
            setIsLoadingData(false);
        }
    }, [itemId, itemType]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllPublicCategory();
                setCategories(response?.resultList ?? []);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.CATEGORY_LOAD_FAILED_FORM);
                console.error(message);
            }
        };

        if (isVisible) {
            fetchCategories();
            fetchItemData();
        }
    }, [isVisible, fetchItemData]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Tiêu đề không được để trống";
        } else if (formData.title.length < 3) {
            newErrors.title = "Tiêu đề phải có ít nhất 3 ký tự";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Mô tả không được để trống";
        } else if (formData.description.length < 10) {
            newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
        }

        if (!formData.categoryId || formData.categoryId === 0) {
            newErrors.categoryId = "Vui lòng chọn danh mục";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setErrors({ submit: handleApiError(err, ERROR_MESSAGES.UPDATE_FAILED_FORM) });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (
        field: keyof FormDataType,
        value: string | number | boolean
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field as string]) {
            setErrors(prev => ({ ...prev, [field as string]: "" }));
        }
    };

    if (!isVisible) return null;

    if (isLoadingData) {
        return (
            <div className="modal-overlay">
                <div className="modal-content update-form-modal">
                    <div className="modal-header">
                        <h2>{itemType === "DOCUMENT" ? "Sửa tài liệu" : "Sửa bài học"}</h2>
                        <button onClick={onClose}>
                            <i className="fa fa-times" />
                        </button>
                    </div>
                    <div className="update-form">
                        <div className="loading-skeleton">Đang tải dữ liệu...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content update-form-modal">
                <div className="modal-header">
                    <h2>{itemType === "DOCUMENT" ? "Sửa tài liệu" : "Sửa bài học"}</h2>
                    <button onClick={onClose} disabled={isSubmitting}>
                        <i className="fa fa-times" />
                    </button>
                </div>

                <div className="update-form">
                    {errors.submit && (
                        <div className="alert alert-error">{errors.submit}</div>
                    )}

                    <div className="form-group">
                        <label>Tiêu đề *</label>
                        <input
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className={errors.title ? "error" : ""}
                        />
                        {errors.title && <div className="error-message">{errors.title}</div>}
                    </div>

                    <div className="form-group">
                        <label>Mô tả *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange("description", e.target.value)
                            }
                            rows={5}
                        />
                        {errors.description && (
                            <div className="error-message">{errors.description}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Danh mục *</label>
                        <select
                            value={formData.categoryId || 0}
                            onChange={(e) =>
                                handleInputChange("categoryId", Number(e.target.value))
                            }
                        >
                            <option value={0}>Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <div className="error-message">{errors.categoryId}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hide}
                                onChange={(e) => handleInputChange("hide", e.target.checked)}
                            />
                            Ẩn khỏi công khai
                        </label>
                        <small className="form-hint">Khi ẩn, nội dung sẽ không hiển thị cho người dùng khác</small>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} disabled={isSubmitting}>
                        Hủy
                    </button>
                    <button onClick={handleSaveClick} disabled={isSubmitting}>
                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormUpdate;
