import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllCategory, hideCategory } from '../../../apis/CategoryApi';
import type { CategoryResponse } from '../../../models/response/CategoryResponse';
import PageHeader from '../components/PageHeader';
import Stats from '../components/Stats';
import Filter from '../components/Filter';
import Table from '../components/Table';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
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
        const { id, name, hide } = category;
        const confirmMessage = hide
            ? `Bạn có muốn hiển thị lại danh mục "${name}"?`
            : `Bạn có chắc chắn muốn ẩn danh mục "${name}"?`;

        const confirmToggle = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            setUpdatingId(id);
            await hideCategory(id, { hide: !hide, updatedAt: new Date() });
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

    const tableColumns = [
        {
            key: 'id',
            header: 'Mã',
            render: (cat: CategoryResponse) => <span className="muted-cell">#{cat.id}</span>
        },
        {
            key: 'name',
            header: 'Tên danh mục',
            render: (cat: CategoryResponse) => (
                <>
                    <p className="category-name">{cat.name}</p>
                    <span className="category-meta">
                        {cat.hide ? 'Ẩn khỏi trang chủ' : 'Hiển thị cho học viên'}
                    </span>
                </>
            )
        },
        {
            key: 'description',
            header: 'Mô tả',
            render: (cat: CategoryResponse) => <span className="description-cell">{cat.description || '—'}</span>
        },
        {
            key: 'hide',
            header: 'Trạng thái',
            render: (cat: CategoryResponse) => renderStatusPill(cat.hide)
        },
        {
            key: 'actions',
            header: 'Thao tác',
            align: 'right' as const,
            render: (cat: CategoryResponse) => (
                <div className="category-row-actions">
                    <a href={`/categories/edit/${cat.id}`} className="category-btn subtle">
                        Chỉnh sửa
                    </a>
                    <button
                        onClick={() => handleToggleVisibility(cat)}
                        disabled={updatingId === cat.id}
                        className={`category-btn ${cat.hide ? 'primary' : 'danger'}`}
                    >
                        {updatingId === cat.id ? 'Đang cập nhật...' : cat.hide ? 'Hiển thị' : 'Ẩn'}
                    </button>
                </div>
            )
        }
    ];

    const renderTable = () => {
        if (loading) {
            return <LoadingState rows={4} variant="card" />;
        }

        if (!loading && filteredCategories.length === 0) {
            return (
                <EmptyState
                    icon="📂"
                    title="Chưa có danh mục phù hợp"
                    description="Thử thay đổi bộ lọc hoặc tạo mới một danh mục để giúp người dùng tìm kiếm tài liệu nhanh hơn."
                />
            );
        }

        return <Table data={filteredCategories} columns={tableColumns} keyField="id" className="category-table" />;
    };

    return (
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
                    onRefresh={() => setRefreshKey((prev) => prev + 1)}
                    placeholder="Tìm kiếm theo tên hoặc mô tả…"
                    containerClass="category-filters"
                    searchClass="category-search"
                    filterActionsClass="category-filter-actions"
                    filterChipClass="category-filter-chip"
                    buttonClass="category-btn ghost"
                />

                {renderTable()}
            </div>
        </div>
    );
};

export default CategoryList;