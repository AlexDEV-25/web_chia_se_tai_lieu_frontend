import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllCategory, hideCategory } from '../../../apis/CategoryApi';
import type { CategoryResponse } from '../../../models/response/CategoryResponse';
import PageHeader from '../components/PageHeader';
import Stats from '../components/Stats';
import Filter from '../components/Filter';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import LeftSidebar from '../components/LeftSidebar';
import { handleApiError } from '../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../constants/messages';
import { Link } from 'react-router-dom';
type VisibilityFilter = 'all' | 'visible' | 'hidden';

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCategory();
            setCategories(response?.resultList ?? []);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CATEGORY_LOAD_FAILED);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleToggleVisibility = async (category: CategoryResponse) => {
        const { id, name, hide } = category;
        const confirmMessage = hide
            ? `Bạn có muốn hiển thị lại danh mục "${name}"?`
            : `Bạn có chắc chắn muốn ẩn danh mục "${name}"?`;

        const confirmToggle: boolean = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            setUpdatingId(id);
            await hideCategory(id, { hide: !hide, updatedAt: new Date() });
            setCategories((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: !hide } : item
                )
            );

        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CATEGORY_UPDATE_FAILED);
            setError(message);
        } finally {
            setUpdatingId(null);
        }
    };

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

    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-category-page">
                <div className="category-container">
                    <PageHeader
                        title="Danh mục tài liệu"
                        description="Theo dõi và làm mới các nhóm tài liệu để đảm bảo thư viện luôn dễ tìm kiếm."
                        addButtonText="Thêm danh mục"
                        addButtonLink="/categories/add"
                        containerClass="category-page-header"
                        headingClass="category-heading"
                        eyebrowClass="category-eyebrow"
                        buttonClass="category-btn primary"
                    />

                    {error && <ErrorAlert message={error} onRetry={fetchCategories} />}

                    <Stats stats={stats} containerClass="category-stats" cardClass="category-stat-card" />

                    <Filter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterValue={visibilityFilter}
                        onFilterChange={setVisibilityFilter}
                        placeholder="Tìm kiếm theo tên hoặc mô tả…"
                        containerClass="category-filters"
                        searchClass="category-search"
                        filterActionsClass="category-filter-actions"
                        filterChipClass="category-filter-chip"
                    />

                    {loading && <LoadingState rows={4} variant="card" />}

                    {!loading && filteredCategories.length === 0 && (
                        <EmptyState
                            icon="📂"
                            title="Chưa có danh mục phù hợp"
                            description="Thử thay đổi bộ lọc hoặc tạo mới một danh mục để giúp người dùng tìm kiếm tài liệu nhanh hơn."
                        />
                    )}

                    {!loading && filteredCategories.length > 0 && (
                        <div className="table-wrapper category-table">
                            <table className="data-table">
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
                                            <td><span className="muted-cell">#{cat.id}</span></td>
                                            <td><p className="category-name">{cat.name}</p></td>
                                            <td><span className="description-cell">{cat.description || '—'}</span></td>
                                            <td>{renderStatusPill(cat.hide)}</td>
                                            <td className="text-right">
                                                <div className="category-row-actions">
                                                    <Link to={`/categories/edit/${cat.id}`} className="category-btn subtle">
                                                        Chỉnh sửa
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleVisibility(cat)}
                                                        disabled={updatingId === cat.id}
                                                        className={`category-btn ${cat.hide ? 'primary' : 'danger'}`}
                                                    >
                                                        {updatingId === cat.id ? 'Đang cập nhật...' : cat.hide ? 'Hiển thị' : 'Ẩn'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryList;