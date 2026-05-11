import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLesson, deleteLesson } from '../../../../apis/LessonApi';
import PageHeader from '../../components/PageHeader';
import Stats from '../../components/Stats';
import Filter from '../../components/Filter';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import LeftSidebar from '../../components/LeftSidebar';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { LessonAdminResponse } from '../../../../models/response/lesson/LessonAdminResponse';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';
import type { ContentStatus, VisibilityFilter } from '../../../../models/enum/common';

const LessonList: React.FC = () => {
    const [lessons, setLessons] = useState<LessonAdminResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('ALL');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; item: LessonAdminResponse | null }>({ isOpen: false, item: null });

    const fetchLessons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllLesson();
            setLessons(response?.resultList ?? []);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.LESSON_LOAD_FAILED);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    const handleDelete = useCallback((lesson: LessonAdminResponse) => {
        setConfirmDialog({ isOpen: true, item: lesson });
    }, []);

    const handleConfirm = async () => {
        if (!confirmDialog.item) return;

        const { id } = confirmDialog.item;
        try {
            setUpdatingId(id);
            await deleteLesson(id);
            setLessons((prev) => prev.filter((item) => item.id !== id));
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.LESSON_DELETE_FAILED);
            setError(message);
        } finally {
            setUpdatingId(null);
            setConfirmDialog({ isOpen: false, item: null });
        }
    };

    const handleCancel = () => {
        setConfirmDialog({ isOpen: false, item: null });
    };

    const filteredLessons = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();
        return lessons.filter((lesson) => {
            const matchesSearch =
                lowerSearch.length === 0 ||
                lesson.title.toLowerCase().includes(lowerSearch) ||
                lesson.description?.toLowerCase().includes(lowerSearch);
            const matchesVisibility =
                visibilityFilter === 'ALL' ||
                (visibilityFilter === 'VISIBLE' && lesson.status !== 'HIDDEN') ||
                (visibilityFilter === 'HIDDEN' && lesson.status === 'HIDDEN');
            return matchesSearch && matchesVisibility;
        });
    }, [lessons, searchTerm, visibilityFilter]);

    const stats = useMemo(() => {
        const total = lessons.length;
        const hidden = lessons.filter((les) => les.status === 'HIDDEN').length;
        const visible = total - hidden;
        return { total, visible, hidden };
    }, [lessons]);

    const renderStatusPill = (status?: ContentStatus) => {
        const isPublished = status === 'PUBLISHED';
        const isHidden = status === 'HIDDEN';
        return (
            <span className={`lesson-status-pill ${isPublished ? 'is-published' : isHidden ? 'is-hidden' : 'is-pending'}`}>
                {isPublished ? 'Đã duyệt' : isHidden ? 'Đã ẩn' : 'Chờ duyệt'}
            </span>
        );
    };

    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-lesson-page">
                <div className="lesson-container">
                    <PageHeader
                        eyebrow="Quản trị hệ thống"
                        title="Quản lý bài học"
                        description="Theo dõi và quản lý các bài học để đảm bảo chất lượng giáo dục."
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
                        placeholder="Tìm kiếm theo tiêu đề hoặc nội dung…"
                        containerClass="lesson-filters"
                        searchClass="lesson-search"
                        filterActionsClass="lesson-filter-actions"
                        filterChipClass="lesson-filter-chip"
                    />

                    {loading && <LoadingState rows={5} variant="table" />}

                    {!loading && filteredLessons.length === 0 && (
                        <EmptyState icon="📚" title="Chưa có bài học phù hợp" description="Thử thay đổi bộ lọc hoặc tạo một bài học mới để giúp học viên tiếp thu kiến thức." />
                    )}

                    {!loading && filteredLessons.length > 0 && (
                        <div className="lesson-table-wrapper">
                            <table className="data-table">
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
                                            <td><span className="muted-cell">#{les.id}</span></td>
                                            <td>
                                                <div>
                                                    <p className="lesson-title">{les.title}</p>
                                                    <span className="lesson-meta">{les.status === 'HIDDEN' ? 'Ẩn khỏi công khai' : 'Công khai'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="description-cell">
                                                    {les.description ? les.description.substring(0, 50) + '...' : '—'}
                                                </span>
                                            </td>
                                            <td><span>{les.categoryName || 'Chưa phân loại'}</span></td>
                                            <td>{renderStatusPill(les.status as ContentStatus)}</td>
                                            <td className="text-right">
                                                <div className="lesson-row-actions">
                                                    <Link to={`/lessons/edit/${les.id}`} className="lesson-btn subtle">
                                                        Chi tiết
                                                    </Link>
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
                    )}
                </div>
            </div>

            {confirmDialog.isOpen && confirmDialog.item && (
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa bài học "${confirmDialog.item.title}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    confirmText="Xóa"
                    cancelText="Hủy"
                />
            )}
        </div>
    );
};

export default LessonList;
