import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategory, updateCategory } from '../../../apis/CategoryApi';

import type { CategoryResponse } from '../../../models/response/CategoryResponse';
import '../../../styles/pages/_categories.css';

type VisibilityFilter = 'all' | 'visible' | 'hidden';

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCategory();
            setCategories(data?.resultList ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải danh mục';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories, refreshKey]);

    const handleToggleVisibility = useCallback(async (category: CategoryResponse) => {
        const { id, name, description, hide } = category;
        const confirmMessage = hide
            ? `Bạn có muốn hiển thị lại danh mục "${name}"?`
            : `Bạn có chắc chắn muốn ẩn danh mục "${name}"?`;

        const confirmToggle = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            setUpdatingId(id);
            await updateCategory(id, {
                name,
                description: description ?? '',
                hide: !hide
            });
            setCategories((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: !hide } : item
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái danh mục.';
            setError(message);
        } finally {
            setUpdatingId(null);
        }
    }, [categories]);

    const filteredCategories = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();
        return categories.filter((category) => {
            const matchesSearch =
                lowerSearch.length === 0 ||
                category.name.toLowerCase().includes(lowerSearch) ||
                category.description?.toLowerCase().includes(lowerSearch);
            const matchesVisibility =
                visibilityFilter === 'all' ||
                (visibilityFilter === 'visible' && !category.hide) ||
                (visibilityFilter === 'hidden' && category.hide);
            return matchesSearch && matchesVisibility;
        });
    }, [categories, searchTerm, visibilityFilter]);

    const stats = useMemo(() => {
        const total = categories.length;
        const hidden = categories.filter((cat) => cat.hide).length;
        const visible = total - hidden;
        return { total, visible, hidden };
    }, [categories]);

    const renderStatusPill = (isHidden: boolean) => (
        <span className={`category-status-pill ${isHidden ? 'is-hidden' : 'is-visible'}`}>
            {isHidden ? 'Đang ẩn' : 'Đang hiển thị'}
        </span>
    );

    const renderTable = () => {
        if (loading) {
            return (
                <div className="category-card">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="category-loading-row" />
                    ))}
                </div>
            );
        }

        if (!loading && filteredCategories.length === 0) {
            return (
                <div className="category-empty-state">
                    <div className="empty-icon">📂</div>
                    <p className="empty-title">Chưa có danh mục phù hợp</p>
                    <p className="empty-desc">
                        Thử thay đổi bộ lọc hoặc tạo mới một danh mục để giúp người dùng tìm kiếm tài liệu nhanh hơn.
                    </p>
                </div>
            );
        }

        return (
            <div className="category-table-wrapper">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Trạng thái</th>
                            <th className="text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((cat) => (
                            <tr key={cat.id}>
                                <td className="muted-cell">#{cat.id}</td>
                                <td>
                                    <p className="category-name">{cat.name}</p>
                                    <span className="category-meta">
                                        {cat.hide ? 'Ẩn khỏi trang chủ' : 'Hiển thị cho học viên'}
                                    </span>
                                </td>
                                <td className="description-cell">{cat.description || '—'}</td>
                                <td>{renderStatusPill(cat.hide)}</td>
                                <td>
                                    <div className="category-row-actions">
                                        <Link
                                            to={`/categories/edit/${cat.id}`}
                                            className="category-btn subtle"
                                        >
                                            Chỉnh sửa
                                        </Link>
                                        <button
                                            onClick={() => handleToggleVisibility(cat)}
                                            disabled={updatingId === cat.id}
                                            className={`category-btn ${cat.hide ? 'primary' : 'danger'}`}
                                        >
                                            {updatingId === cat.id
                                                ? 'Đang cập nhật...'
                                                : cat.hide
                                                    ? 'Hiển thị'
                                                    : 'Ẩn'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-category-page">
            <div className="category-container">
                <div className="category-page-header">
                    <div className="category-heading">
                        <p className="category-eyebrow">Quản trị hệ thống</p>
                        <h1>Danh mục tài liệu</h1>
                        <p>Theo dõi và làm mới các nhóm tài liệu để đảm bảo thư viện luôn dễ tìm kiếm.</p>
                    </div>
                    <Link to="/categories/add" className="category-btn primary">
                        Thêm danh mục
                    </Link>
                </div>

                {error && (
                    <div className="category-alert error">
                        <p>Lỗi: {error}</p>
                        <button type="button" onClick={fetchCategories} className="category-btn ghost">
                            Thử lại
                        </button>
                    </div>
                )}

                <div className="category-stats">
                    <div className="category-stat-card">
                        <span className="stat-label">Tổng danh mục</span>
                        <strong className="stat-value">{stats.total}</strong>
                        <p className="stat-desc">Tất cả nhóm tài liệu đang có</p>
                    </div>
                    <div className="category-stat-card positive">
                        <span className="stat-label">Đang hiển thị</span>
                        <strong className="stat-value">{stats.visible}</strong>
                        <p className="stat-desc">Xuất hiện trên trang người dùng</p>
                    </div>
                    <div className="category-stat-card warning">
                        <span className="stat-label">Đang ẩn</span>
                        <strong className="stat-value">{stats.hidden}</strong>
                        <p className="stat-desc">Cần duyệt trước khi hiển thị</p>
                    </div>
                </div>

                <div className="category-filters">
                    <div className="category-search">
                        <i className="fa fa-search" aria-hidden="true" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên hoặc mô tả…"
                        />
                    </div>
                    <div className="category-filter-actions">
                        {(['all', 'visible', 'hidden'] as VisibilityFilter[]).map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setVisibilityFilter(filter)}
                                className={`category-filter-chip ${visibilityFilter === filter ? 'is-active' : ''}`}
                            >
                                {filter === 'all'
                                    ? 'Tất cả'
                                    : filter === 'visible'
                                        ? 'Đang hiển thị'
                                        : 'Đang ẩn'}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setRefreshKey((prev) => prev + 1)}
                            className="category-btn ghost"
                        >
                            Làm mới
                        </button>
                    </div>
                </div>

                {renderTable()}
            </div>
        </div>
    );
};

export default CategoryList;