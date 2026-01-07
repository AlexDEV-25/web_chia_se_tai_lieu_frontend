import React, { useEffect, useState, useCallback } from 'react';
import { getAllCategory } from '../../../../apis/CategoryApi';
import type { CategoryResponse } from '../../../../models/response/CategoryResponse';
import axios from 'axios';

interface Stats {
    label: string;
    value: number;
    description?: string;
}

interface PropertyItem {
    label: string;
    value: string | number | React.ReactNode;
    editable?: boolean;
    onChange?: (value: string | number | undefined) => void;
    isCategory?: boolean;
    currentCategoryName?: string;
}

interface RightPropertiesProps {
    // Basic info
    basicInfo: PropertyItem[];

    // Statistics
    stats: Stats[];

    // Status & Visibility
    status: 'PENDING' | 'PUBLISHED';
    onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

    hide: boolean;
    onHideChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

    // Dates
    createdAt?: string;
    updatedAt?: string;

    // Actions
    onClose: () => void;
    onSave?: () => void;

    // Disabled state
    saving?: boolean;

    // Custom class prefix
    classPrefix?: string;
}

const RightProperties: React.FC<RightPropertiesProps> = ({
    basicInfo,
    stats,
    status,
    onStatusChange,
    hide,
    onHideChange,
    createdAt,
    updatedAt,
    onClose,
    onSave,
    saving = false,
    classPrefix = 'document'
}) => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const response = await getAllCategory();
            if (response?.resultList) {
                setCategories(response.resultList);
            }
        } catch (err: any) {
            let message = "Lỗi tải danh mục. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            console.error(message);
        } finally {
            setLoadingCategories(false);
        }
    }, []);
    const btnClass = `${classPrefix}-btn`;
    const propertyCardClass = `${classPrefix}-property-card`;
    const sectionTitleClass = `${classPrefix}-section-title`;
    const propertyGroupClass = `${classPrefix}-property-group`;
    const propertyItemClass = `${classPrefix}-property-item`;
    const propertyLabelClass = `${classPrefix}-property-label`;
    const propertyValueClass = `${classPrefix}-property-value`;
    const selectClass = `${classPrefix}-select`;
    const statsGridClass = `${classPrefix}-stats-grid`;
    const statItemClass = `${classPrefix}-stat-item`;
    const statLabelClass = `${classPrefix}-stat-label`;
    const statNumberClass = `${classPrefix}-stat-number`;
    const actionsClass = `${classPrefix}-actions`;
    const propertiesSectionClass = `${classPrefix}-properties-section`;

    return (
        <div className={propertiesSectionClass}>
            {/* Basic Info */}
            <div className={propertyCardClass}>
                <h3 className={sectionTitleClass}>Thông tin cơ bản</h3>
                <div className={propertyGroupClass}>
                    {basicInfo.map((item, index) => (
                        <div key={index} className={propertyItemClass}>
                            <label className={propertyLabelClass}>{item.label}</label>
                            {item.editable ? (
                                item.isCategory ? (
                                    <select
                                        value={String(item.value || '')}
                                        onChange={(e) => item.onChange?.(e.target.value ? Number(e.target.value) : undefined)}
                                        disabled={saving || loadingCategories}
                                        className={selectClass}
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((cat) => (cat.hide ? null : (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        )))}
                                    </select>
                                ) : (
                                    <textarea
                                        value={String(item.value || '')}
                                        onChange={(e) => item.onChange?.(e.target.value)}
                                        disabled={saving}
                                        className={selectClass}
                                        style={{ minHeight: item.label === 'Mô tả' ? '80px' : '40px', resize: 'vertical' }}
                                    />
                                )
                            ) : (
                                <p className={propertyValueClass + (item.label === 'Mô tả' ? ' description-text' : '')}>
                                    {item.value || '—'}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics */}
            {stats.length > 0 && (
                <div className={propertyCardClass}>
                    <h3 className={sectionTitleClass}>Thống kê</h3>
                    <div className={statsGridClass}>
                        {stats.map((stat, index) => (
                            <div key={index} className={statItemClass}>
                                <span className={statLabelClass}>{stat.label}</span>
                                <strong className={statNumberClass}>{stat.value}</strong>
                                {stat.description && (
                                    <span className={statLabelClass} style={{ fontSize: '11px', marginTop: '4px' }}>
                                        {stat.description}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status & Visibility */}
            <div className={propertyCardClass}>
                <h3 className={sectionTitleClass}>Trạng thái & Hiển thị</h3>
                <div className={propertyGroupClass}>
                    <div className={propertyItemClass}>
                        <label htmlFor="status" className={propertyLabelClass}>
                            Trạng thái
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={onStatusChange}
                            disabled={saving}
                            className={selectClass}
                        >
                            <option value="PENDING">Chờ duyệt</option>
                            <option value="PUBLISHED">Đã xuất bản</option>
                        </select>
                    </div>

                    <div className={propertyItemClass}>
                        <label htmlFor="hide" className={propertyLabelClass}>
                            Ẩn / Hiển thị
                        </label>
                        <select
                            id="hide"
                            value={hide ? 'true' : 'false'}
                            onChange={onHideChange}
                            disabled={saving}
                            className={selectClass}
                        >
                            <option value="false">Đang hiển thị</option>
                            <option value="true">Đang ẩn</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Dates */}
            <div className={propertyCardClass}>
                <h3 className={sectionTitleClass}>Ngày tháng</h3>
                <div className={propertyGroupClass}>
                    <div className={propertyItemClass}>
                        <label className={propertyLabelClass}>Ngày tạo</label>
                        <p className={propertyValueClass}>
                            {createdAt ? new Date(createdAt).toLocaleString('vi-VN') : '—'}
                        </p>
                    </div>

                    <div className={propertyItemClass}>
                        <label className={propertyLabelClass}>Cập nhật lần cuối</label>
                        <p className={propertyValueClass}>
                            {updatedAt ? new Date(updatedAt).toLocaleString('vi-VN') : '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={actionsClass}>
                {onSave ? (
                    <>
                        <button onClick={onSave} className={`${btnClass} primary`} disabled={saving}>
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <button onClick={onClose} className={`${btnClass} secondary`} disabled={saving}>
                            Hủy
                        </button>
                    </>
                ) : (
                    <button onClick={onClose} className={`${btnClass} secondary`}>
                        Lưu và quay lại
                    </button>
                )}
            </div>
        </div>
    );
};

export default RightProperties;
