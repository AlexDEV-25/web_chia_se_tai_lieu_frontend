import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLesson, deleteLesson, hideLesson } from '../../../../apis/LessonApi';
import PageHeader from '../components/PageHeader';
import Stats from '../components/Stats';
import Filter from '../components/Filter';
import Table from '../components/Table';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

import type { LessonResponse } from '../../../../models/response/LessonResponse';
// import '../../../../styles/pages/_lessons.css';

type VisibilityFilter = 'all' | 'visible' | 'hidden';

const LessonList: React.FC = () => {
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchLessons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllLesson();
            setLessons(data?.resultList ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải bài học';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLessons();
    }, [fetchLessons, refreshKey]);

    const handleToggleVisibility = useCallback(async (lesson: LessonResponse) => {
        const { id, title, hide } = lesson;
        const confirmMessage = hide
            ? `Bạn có muốn hiển thị lại bài học "${title}"?`
            : `Bạn có chắc chắn muốn ẩn bài học "${title}"?`;

        const confirmToggle = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            setUpdatingId(id);
            await hideLesson(id, {
                hide: !hide,
                updatedAt: new Date()
            });
            setLessons((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: !hide } : item
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái bài học.';
            setError(message);
        } finally {
            setUpdatingId(null);
        }
    }, [lessons]);

    const handleDelete = useCallback(async (lesson: LessonResponse) => {
        const { id, title } = lesson;
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa bài học "${title}"? Hành động này không thể hoàn tác.`);
        if (!confirmDelete) return;

        try {
            setUpdatingId(id);
            await deleteLesson(id);
            setLessons((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xóa bài học.';
            setError(message);
        } finally {
            setUpdatingId(null);
        }
    }, []);

    const filteredLessons = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();
        return lessons.filter((lesson) => {
            const matchesSearch =
                lowerSearch.length === 0 ||
                lesson.title.toLowerCase().includes(lowerSearch) ||
                lesson.description?.toLowerCase().includes(lowerSearch);
            const matchesVisibility =
                visibilityFilter === 'all' ||
                (visibilityFilter === 'visible' && !lesson.hide) ||
                (visibilityFilter === 'hidden' && lesson.hide);
            return matchesSearch && matchesVisibility;
        });
    }, [lessons, searchTerm, visibilityFilter]);

    const stats = useMemo(() => {
        const total = lessons.length;
        const hidden = lessons.filter((les) => les.hide).length;
        const visible = total - hidden;
        return { total, visible, hidden };
    }, [lessons]);

    const renderStatusPill = (isHidden: boolean) => (
        <span className={`lesson-status-pill ${isHidden ? 'is-hidden' : 'is-visible'}`}>
            {isHidden ? 'Đang ẩn' : 'Đang hiển thị'}
        </span>
    );

    const tableColumns = [
        {
            key: 'id',
            header: 'Mã',
            render: (les: LessonResponse) => <span className="muted-cell">#{les.id}</span>
        },
        {
            key: 'title',
            header: 'Tiêu đề',
            render: (les: LessonResponse) => (
                <div>
                    <p className="lesson-title">{les.title}</p>
                    <span className="lesson-meta">{les.hide ? 'Ẩn khỏi công khai' : 'Công khai'}</span>
                </div>
            )
        },
        {
            key: 'description',
            header: 'Nội dung',
            render: (les: LessonResponse) => (
                <span className="description-cell">
                    {les.description ? les.description.substring(0, 50) + '...' : '—'}
                </span>
            )
        },
        {
            key: 'categoryName',
            header: 'Danh mục',
            render: (les: LessonResponse) => <span>{les.categoryName || 'Chưa phân loại'}</span>
        },
        {
            key: 'hide',
            header: 'Trạng thái',
            render: (les: LessonResponse) => renderStatusPill(les.hide)
        },
        {
            key: 'actions',
            header: 'Thao tác',
            align: 'right' as const,
            render: (les: LessonResponse) => (
                <div className="lesson-row-actions">
                    <Link to={`/lessons/edit/${les.id}`} className="lesson-btn subtle">
                        Chi tiết
                    </Link>
                    <button
                        onClick={() => handleToggleVisibility(les)}
                        disabled={updatingId === les.id}
                        className={`lesson-btn ${les.hide ? 'primary' : 'danger'}`}
                    >
                        {updatingId === les.id ? 'Đang cập nhật...' : les.hide ? 'Hiển thị' : 'Ẩn'}
                    </button>
                    <button
                        onClick={() => handleDelete(les)}
                        disabled={updatingId === les.id}
                        className="lesson-btn danger"
                    >
                        {updatingId === les.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="admin-lesson-page">
            <div className="lesson-container">
                <PageHeader
                    eyebrow="Quản trị hệ thống"
                    title="Quản lý bài học"
                    description="Theo dõi và quản lý các bài học để đảm bảo chất lượng giáo dục."
                    addButtonText="Thêm bài học"
                    addButtonLink="/lessons/add"
                    containerClass="lesson-page-header"
                    headingClass="lesson-heading"
                    eyebrowClass="lesson-eyebrow"
                    buttonClass="lesson-btn primary"
                />

                {error && (
                    <ErrorAlert message={error} onRetry={fetchLessons} />
                )}

                <Stats stats={stats} containerClass="lesson-stats" cardClass="lesson-stat-card" />

                <Filter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterValue={visibilityFilter}
                    onFilterChange={setVisibilityFilter}
                    onRefresh={() => setRefreshKey((prev) => prev + 1)}
                    placeholder="Tìm kiếm theo tiêu đề hoặc nội dung…"
                    containerClass="lesson-filters"
                    searchClass="lesson-search"
                    filterActionsClass="lesson-filter-actions"
                    filterChipClass="lesson-filter-chip"
                    buttonClass="lesson-btn ghost"
                />

                {loading && <LoadingState />}

                {!loading && filteredLessons.length === 0 && (
                    <EmptyState icon="📚" title="Chưa có bài học phù hợp" description="Thử thay đổi bộ lọc hoặc tạo một bài học mới để giúp học viên tiếp thu kiến thức." />
                )}

                {!loading && filteredLessons.length > 0 && (
                    <div className="lesson-table-wrapper">
                        <Table columns={tableColumns} data={filteredLessons} keyField="id" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonList;
