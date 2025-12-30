import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLesson, updateLesson, deleteLesson } from '../../../../apis/LessonApi';

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
            await updateLesson(id, {
                title,
                description: lesson.description ?? '',
                hide: !hide
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

    const renderTable = () => {
        if (loading) {
            return (
                <div className="lesson-card">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="lesson-loading-row" />
                    ))}
                </div>
            );
        }

        if (!loading && filteredLessons.length === 0) {
            return (
                <div className="lesson-empty-state">
                    <div className="empty-icon">📚</div>
                    <p className="empty-title">Chưa có bài học phù hợp</p>
                    <p className="empty-desc">
                        Thử thay đổi bộ lọc hoặc tạo một bài học mới để giúp học viên tiếp thu kiến thức.
                    </p>
                </div>
            );
        }

        return (
            <div className="lesson-table-wrapper">
                <table className="lesson-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Tiêu đề</th>
                            <th>Nội dung</th>
                            <th>Danh mục</th>
                            <th>Trạng thái</th>
                            <th className="text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLessons.map((les) => (
                            <tr key={les.id}>
                                <td className="muted-cell">#{les.id}</td>
                                <td>
                                    <p className="lesson-title">{les.title}</p>
                                    <span className="lesson-meta">
                                        {les.hide ? 'Ẩn khỏi công khai' : 'Công khai'}
                                    </span>
                                </td>
                                <td className="description-cell">{les.description ? les.description.substring(0, 50) + '...' : '—'}</td>
                                <td>{les.categoryName || 'Chưa phân loại'}</td>
                                <td>{renderStatusPill(les.hide)}</td>
                                <td>
                                    <div className="lesson-row-actions">
                                        <Link
                                            to={`/lessons/edit/${les.id}`}
                                            className="lesson-btn subtle"
                                        >
                                            Chỉnh sửa
                                        </Link>
                                        <button
                                            onClick={() => handleToggleVisibility(les)}
                                            disabled={updatingId === les.id}
                                            className={`lesson-btn ${les.hide ? 'primary' : 'danger'}`}
                                        >
                                            {updatingId === les.id
                                                ? 'Đang cập nhật...'
                                                : les.hide
                                                    ? 'Hiển thị'
                                                    : 'Ẩn'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(les)}
                                            disabled={updatingId === les.id}
                                            className="lesson-btn danger"
                                        >
                                            {updatingId === les.id ? 'Đang xóa...' : 'Xóa'}
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
        <div className="admin-lesson-page">
            <div className="lesson-container">
                <div className="lesson-page-header">
                    <div className="lesson-heading">
                        <p className="lesson-eyebrow">Quản trị hệ thống</p>
                        <h1>Quản lý bài học</h1>
                        <p>Theo dõi và quản lý các bài học để đảm bảo chất lượng giáo dục.</p>
                    </div>
                    <Link to="/lessons/add" className="lesson-btn primary">
                        Thêm bài học
                    </Link>
                </div>

                {error && (
                    <div className="lesson-alert error">
                        <p>Lỗi: {error}</p>
                        <button type="button" onClick={fetchLessons} className="lesson-btn ghost">
                            Thử lại
                        </button>
                    </div>
                )}

                <div className="lesson-stats">
                    <div className="lesson-stat-card">
                        <span className="stat-label">Tổng bài học</span>
                        <strong className="stat-value">{stats.total}</strong>
                        <p className="stat-desc">Tất cả bài học đang có</p>
                    </div>
                    <div className="lesson-stat-card positive">
                        <span className="stat-label">Đang hiển thị</span>
                        <strong className="stat-value">{stats.visible}</strong>
                        <p className="stat-desc">Công khai cho học viên</p>
                    </div>
                    <div className="lesson-stat-card warning">
                        <span className="stat-label">Đang ẩn</span>
                        <strong className="stat-value">{stats.hidden}</strong>
                        <p className="stat-desc">Chờ được duyệt</p>
                    </div>
                </div>

                <div className="lesson-filters">
                    <div className="lesson-search">
                        <i className="fa fa-search" aria-hidden="true" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung…"
                        />
                    </div>
                    <div className="lesson-filter-actions">
                        {(['all', 'visible', 'hidden'] as VisibilityFilter[]).map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setVisibilityFilter(filter)}
                                className={`lesson-filter-chip ${visibilityFilter === filter ? 'is-active' : ''}`}
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
                            className="lesson-btn ghost"
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

export default LessonList;
