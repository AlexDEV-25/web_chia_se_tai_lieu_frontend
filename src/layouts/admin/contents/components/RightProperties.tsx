import React, { useEffect, useState, useCallback } from "react";
import { getAllCategory } from "../../../../apis/CategoryApi";
import type { CategoryResponse } from "../../../../models/response/category/CategoryResponse";
import type { ContentStatus, InteractionType } from "../../../../models/enum/common";


interface BaseContent {
    id: number;
    title: string;
    description?: string;
    categoryId?: number;
    status: ContentStatus;
    createdAt?: string;
    updatedAt?: string;
    views?: number;
    downloads?: number;
}

interface RightPropertiesProps {
    type: InteractionType;
    data: BaseContent;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setCategoryId: (value?: number) => void;
    setStatus: (value: ContentStatus) => void;
    onSave: () => void;
    onClose: () => void;
    saving?: boolean;
}

const RightProperties: React.FC<RightPropertiesProps> = ({
    type,
    data,
    setTitle,
    setDescription,
    setCategoryId,
    setStatus,
    onSave,
    onClose,
    saving = false,
}) => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            const response = await getAllCategory();
            setCategories(response?.resultList ?? []);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="document-properties-section">
            <div className="document-property-card">
                <h3 className="document-section-title">Thông tin cơ bản</h3>

                <div className="property-item">
                    <label>ID</label>
                    <p>#{data.id}</p>
                </div>

                <div className="property-item">
                    <label>Tiêu đề</label>
                    <textarea
                        value={data.title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={saving}
                        className="document-select"
                    />
                </div>

                <div className="property-item">
                    <label>Mô tả</label>
                    <textarea
                        value={data.description ?? ""}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={saving}
                        className="document-select description"
                    />
                </div>

                <div className="property-item">
                    <label>Danh mục</label>
                    <select
                        value={data.categoryId ?? ""}
                        onChange={(e) =>
                            setCategoryId(e.target.value ? Number(e.target.value) : undefined)
                        }
                        disabled={saving || loadingCategories}
                        className="document-select"
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.filter((c) => !c.hide).map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="document-property-card">
                <h3 className="document-section-title">Thống kê</h3>

                <div className="stats-list">
                    <div className="stat-item">
                        <span>Lượt xem</span>
                        <strong>{data.views ?? 0}</strong>
                    </div>

                    {type === "DOCUMENT" && (
                        <div className="stat-item">
                            <span>Lượt tải</span>
                            <strong>{data.downloads ?? 0}</strong>
                        </div>
                    )}
                </div>
            </div>

            <div className="document-property-card">
                <h3 className="document-section-title">Trạng thái & Hiển thị</h3>

                <div className="property-item">
                    <label>Trạng thái</label>
                    <select
                        value={data.status}
                        onChange={(e) =>
                            setStatus(e.target.value as ContentStatus)
                        }
                        disabled={saving}
                        className="document-select"
                    >
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="PUBLISHED">Đã xuất bản</option>
                        <option value="HIDDEN">Đã ẩn</option>
                    </select>
                </div>


            </div>

            <div className="document-property-card">
                <h3 className="document-section-title">Ngày tháng</h3>

                <div className="property-item">
                    <label>Ngày tạo</label>
                    <p>
                        {data.createdAt
                            ? new Date(data.createdAt).toLocaleString("vi-VN")
                            : "—"}
                    </p>
                </div>

                <div className="property-item">
                    <label>Cập nhật lần cuối</label>
                    <p>
                        {data.updatedAt
                            ? new Date(data.updatedAt).toLocaleString("vi-VN")
                            : "—"}
                    </p>
                </div>
            </div>

            <div className="document-actions">
                <button
                    onClick={onSave}
                    className="document-btn primary"
                    disabled={saving}
                >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>

                <button
                    onClick={onClose}
                    className="document-btn secondary"
                    disabled={saving}
                >
                    Hủy
                </button>
            </div>
        </div>
    );
};

export default RightProperties;