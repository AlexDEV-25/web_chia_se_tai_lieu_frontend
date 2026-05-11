import React, { useCallback, useEffect, useMemo, useState } from 'react';

import LeftSidebar from '../../components/LeftSidebar';
import PageHeader from '../../components/PageHeader';
import Stats from '../../components/Stats';
import Filter from '../../components/Filter';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getAllDocumentComments, getAllLessonComments, hideComment, filterComment } from '../../../../apis/CommentApi';
import type { CommentResponse } from '../../../../models/response/comment/CommentResponse';
import type { HideRequest } from '../../../../models/request/DisplayRequest';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';
import { renderStatusPill } from '../../components/StatusPill';
import type { InteractionType, VisibilityFilter } from '../../../../models/enum/common';



type CommentWithType = CommentResponse & { type: InteractionType };

const CommentList: React.FC = () => {
    const [comments, setComments] = useState<CommentWithType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('ALL');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [isInvalidView, setIsInvalidView] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<InteractionType>('DOCUMENT');
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'visibility' | 'delete'; comment?: CommentWithType } | null>(null);

    const fetchComments = useCallback(async (invalidOnly: boolean) => {
        setLoading(true);
        setError(null);
        try {
            if (invalidOnly) {
                const response = await filterComment(activeTab);
                const list = response.resultList ?? (response.result ? [response.result] : []);
                setComments(list as CommentWithType[]);
            } else {
                const [docRes, lessonRes] = await Promise.all([
                    getAllDocumentComments(),
                    getAllLessonComments()
                ]);
                const docComments = (docRes.resultList || []).map(item => ({ ...item, type: 'DOCUMENT' as InteractionType }));
                const lessonComments = (lessonRes.resultList || []).map(item => ({ ...item, type: 'LESSON' as InteractionType }));
                setComments([...docComments, ...lessonComments]);
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.COMMENT_LOAD_FAILED);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComments(isInvalidView);
    }, [fetchComments, isInvalidView]);

    const handleToggleVisibility = useCallback(
        (comment: CommentWithType) => {
            setConfirmDialog({ isOpen: true, type: 'visibility', comment });
        },
        []
    );


    const handleConfirm = useCallback(async () => {
        if (!confirmDialog?.comment) return;

        const { comment, type } = confirmDialog;
        const { id, hide } = comment;

        if (type === 'visibility') {
            try {
                setUpdatingId(id);
                const payload: HideRequest = { hide: !hide, type: comment.type };
                await hideComment(id, payload);
                setComments((prev) =>
                    prev.map((item) => (item.id === id ? { ...item, hide: !hide } : item))
                );
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.DELETE_FAILED);
                setError(message);
            } finally {
                setUpdatingId(null);
            }
        }

        setConfirmDialog(null);
    }, [confirmDialog]);

    const handleCancel = useCallback(() => {
        setConfirmDialog(null);
    }, []);

    const filteredComments = useMemo(() => {
        return comments.filter((comment) => {
            const matchesType = comment.type.toLowerCase() === activeTab;
            const matchesVisibility =
                visibilityFilter === 'ALL' ||
                (visibilityFilter === 'VISIBLE' && !comment.hide) ||
                (visibilityFilter === 'HIDDEN' && comment.hide);

            return matchesType && matchesVisibility;
        });
    }, [comments, activeTab, visibilityFilter]);

    const stats = useMemo(() => {
        const tabComments = comments.filter(c => c.type.toLowerCase() === activeTab);
        const total = tabComments.length;
        const hidden = tabComments.filter((c) => c.hide).length;
        const visible = total - hidden;
        return { total, visible, hidden };
    }, [comments, activeTab]);

    const documentCount = comments.filter(c => c.type === 'DOCUMENT').length;
    const lessonCount = comments.filter(c => c.type === 'LESSON').length;


    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-category-page">
                <div className="category-container">
                    <PageHeader
                        title="Quản lý bình luận"
                        description="Theo dõi và kiểm duyệt các bình luận để giữ môi trường học tập lành mạnh."
                        containerClass="category-page-header"
                        headingClass="category-heading"
                        eyebrowClass="category-eyebrow"
                        buttonClass="category-btn primary"
                    />

                    {error && (
                        <ErrorAlert message={error} onRetry={() => fetchComments(isInvalidView)} />
                    )}

                    <Stats stats={stats} containerClass="category-stats" cardClass="category-stat-card" />

                    <div className="btn-group mb-4" role="group" aria-label="Tabs bình luận">
                        <button
                            type="button"
                            className={`btn ${activeTab === 'DOCUMENT' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('DOCUMENT')}
                        >
                            Tài liệu ({documentCount})
                        </button>
                        <button
                            type="button"
                            className={`btn ${activeTab === 'LESSON' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('LESSON')}
                        >
                            Bài giảng ({lessonCount})
                        </button>
                    </div>

                    <div className="category-filters invalid-toggle-row">
                        <Filter
                            searchTerm=""
                            onSearchChange={() => { }}
                            filterValue={visibilityFilter}
                            onFilterChange={setVisibilityFilter}
                            placeholder=""
                            containerClass="category-filters-inner"
                            searchClass="d-none"
                            filterActionsClass="category-filter-actions"
                            filterChipClass="category-filter-chip"
                        />

                        <button
                            type="button"
                            className={`category-btn ${isInvalidView ? 'primary' : 'ghost'}`}
                            onClick={() => setIsInvalidView((prev: boolean) => !prev)}
                        >
                            {isInvalidView
                                ? 'Hiển thị tất cả bình luận'
                                : 'Lọc các bình luận không hợp lệ'}
                        </button>
                    </div>

                    {loading && (
                        <div>
                            <LoadingState rows={4} variant="card" />
                            {isInvalidView && (
                                <p className="text-muted small mt-2 mb-0">
                                    Đang quét và tải danh sách bình luận không hợp lệ, vui lòng chờ...
                                </p>
                            )}
                        </div>
                    )}

                    {!loading && filteredComments.length === 0 && (
                        <EmptyState
                            icon="💬"
                            title={isInvalidView ? 'Không có bình luận không hợp lệ' : 'Chưa có bình luận phù hợp'}
                            description={
                                isInvalidView
                                    ? 'Hiện tại không phát hiện bình luận nào không hợp lệ theo gợi ý của hệ thống.'
                                    : 'Thử thay đổi bộ lọc hoặc đợi thêm bình luận mới từ người dùng.'
                            }
                        />
                    )}

                    {!loading && filteredComments.length > 0 && (
                        <div className="table-wrapper category-table">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Nội dung bình luận</th>
                                        <th>Loại nội dung</th>
                                        <th>Trạng thái</th>
                                        <th className="text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComments.map((c) => (
                                        <tr key={`${c.type}-${c.id}`}>
                                            <td><span className="muted-cell">#{c.id}</span></td>
                                            <td><p className="category-name">{c.content}</p></td>
                                            <td>
                                                <span className="description-cell">
                                                    {c.type === 'DOCUMENT' ? 'Tài liệu' : 'Bài giảng'}
                                                </span>
                                            </td>
                                            <td>{renderStatusPill(c.hide)}</td>
                                            <td className="text-right">
                                                <div className="category-row-actions">
                                                    <button
                                                        onClick={() => handleToggleVisibility(c)}
                                                        disabled={updatingId === c.id}
                                                        className={`category-btn ${c.hide ? 'primary' : 'danger'}`}
                                                    >
                                                        {updatingId === c.id ? 'Đang cập nhật...'
                                                            : c.hide ? 'Hiển thị' : 'Ẩn'}
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

            {confirmDialog?.isOpen && confirmDialog.comment && (
                <ConfirmDialog
                    isOpen={true}
                    title={
                        confirmDialog.type === 'visibility'
                            ? (confirmDialog.comment.hide ? 'Hiển thị bình luận' : 'Ẩn bình luận')
                            : 'Xóa bình luận'
                    }
                    message={
                        confirmDialog.type === 'visibility'
                            ? (confirmDialog.comment.hide
                                ? `Bạn có muốn hiển thị lại bình luận này?\n\n"${confirmDialog.comment.content.slice(0, 80)}${confirmDialog.comment.content.length > 80 ? '…' : ''}"`
                                : `Bạn có chắc chắn muốn ẩn bình luận này?\n\n"${confirmDialog.comment.content.slice(0, 80)}${confirmDialog.comment.content.length > 80 ? '…' : ''}"`)
                            : `Bạn có chắc chắn muốn xóa bình luận này?\n\n"${confirmDialog.comment.content.slice(0, 80)}${confirmDialog.comment.content.length > 80 ? '…' : ''}"`
                    }
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    confirmText={confirmDialog.type === 'visibility' ? (confirmDialog.comment.hide ? 'Hiển thị' : 'Ẩn') : 'Xóa'}
                    cancelText="Hủy"
                />
            )}
        </div>
    );
};

export default CommentList;