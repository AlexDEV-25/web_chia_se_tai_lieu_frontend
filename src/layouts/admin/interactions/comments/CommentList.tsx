import React, { useCallback, useEffect, useMemo, useState } from 'react';

import LeftSidebar from '../../components/LeftSidebar';
import PageHeader from '../../components/PageHeader';
import Stats from '../../components/Stats';
import Filter from '../../components/Filter';
import Table from '../../components/Table';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import { getAllComments, hideComment, deleteComment } from '../../../../apis/CommentApi';
import { filterCommnent } from '../../../../apis/ChatGemini';
import type { CommentResponse } from '../../../../models/response/CommentResponse';
import type { HideRequest } from '../../../../models/request/HideRequest';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';

type VisibilityFilter = 'all' | 'visible' | 'hidden';

const CommentList: React.FC = () => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isInvalidView, setIsInvalidView] = useState<boolean>(false);

    const fetchComments = useCallback(async (invalidOnly: boolean) => {
        setLoading(true);
        setError(null);
        try {
            if (invalidOnly) {
                const response = await filterCommnent();
                const list = response.resultList ?? (response.result ? [response.result] : []);
                setComments(list as CommentResponse[]);
            } else {
                const response = await getAllComments();
                const list = response.resultList ?? (response.result ? [response.result] : []);
                setComments(list as CommentResponse[]);
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
    }, [fetchComments, refreshKey, isInvalidView]);

    const handleToggleVisibility = useCallback(
        async (comment: CommentResponse) => {
            const { id, content, hide } = comment;
            const confirmMessage = hide
                ? `Bạn có muốn hiển thị lại bình luận này?\n\n\"${content.slice(0, 80)}${content.length > 80 ? '…' : ''
                }\"`
                : `Bạn có chắc chắn muốn ẩn bình luận này?\n\n\"${content.slice(0, 80)}${content.length > 80 ? '…' : ''
                }\"`;

            const confirmToggle = window.confirm(confirmMessage);
            if (!confirmToggle) return;

            try {
                setUpdatingId(id);
                const payload: HideRequest = { hide: !hide, updatedAt: new Date() };
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
        },
        []
    );

    const handleDelete = useCallback(async (comment: CommentResponse) => {
        const { id, content } = comment;
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn xóa bình luận này?\n\n\"${content.slice(0, 80)}${content.length > 80 ? '…' : ''
            }\"`
        );
        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await deleteComment(id);
            setComments((prev) => prev.filter((item) => item.id !== id));
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DELETE_FAILED);
            setError(message);
        } finally {
            setDeletingId(null);
        }
    }, []);

    const filteredComments = useMemo(() => {
        return comments.filter((comment) => {
            const matchesVisibility =
                visibilityFilter === 'all' ||
                (visibilityFilter === 'visible' && !comment.hide) ||
                (visibilityFilter === 'hidden' && comment.hide);

            return matchesVisibility;
        });
    }, [comments, visibilityFilter]);

    const stats = useMemo(() => {
        const total = comments.length;
        const hidden = comments.filter((c) => c.hide).length;
        const visible = total - hidden;
        return { total, visible, hidden };
    }, [comments]);

    const renderStatusPill = (isHidden: boolean) => (
        <span className={`category-status-pill ${isHidden ? 'is-hidden' : 'is-visible'}`}>
            {isHidden ? 'Đang ẩn' : 'Đang hiển thị'}
        </span>
    );

    const tableColumns = [
        {
            key: 'id',
            header: 'Mã',
            render: (c: CommentResponse) => <span className="muted-cell">#{c.id}</span>,
        },
        {
            key: 'content',
            header: 'Nội dung bình luận',
            render: (c: CommentResponse) => (
                <>
                    <p className="category-name">{c.content}</p>
                </>
            ),
        },
        {
            key: 'type',
            header: 'Loại nội dung',
            render: (c: CommentResponse) => (
                <span className="description-cell">
                    {c.type === 'DOCUMENT' ? 'Tài liệu' : 'Bài giảng'}
                </span>
            ),
        },
        {
            key: 'hide',
            header: 'Trạng thái',
            render: (c: CommentResponse) => renderStatusPill(c.hide),
        },
        {
            key: 'actions',
            header: 'Thao tác',
            align: 'right' as const,
            render: (c: CommentResponse) => (
                <div className="category-row-actions">
                    <button
                        onClick={() => handleToggleVisibility(c)}
                        disabled={updatingId === c.id || deletingId === c.id}
                        className={`category-btn ${c.hide ? 'primary' : 'danger'}`}
                    >
                        {updatingId === c.id
                            ? 'Đang cập nhật...'
                            : c.hide
                                ? 'Hiển thị'
                                : 'Ẩn'}
                    </button>
                    <button
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                        className="category-btn danger"
                    >
                        {deletingId === c.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            ),
        },
    ];

    const renderTable = () => {
        if (loading) {
            // Khi đang ở chế độ xem bình luận không hợp lệ, hiển thị thông điệp rõ ràng hơn
            return (
                <div>
                    <LoadingState rows={4} variant="card" />
                    {isInvalidView && (
                        <p className="text-muted small mt-2 mb-0">
                            Đang quét và tải danh sách bình luận không hợp lệ, vui lòng chờ...
                        </p>
                    )}
                </div>
            );
        }

        if (!loading && filteredComments.length === 0) {
            return (
                <EmptyState
                    icon="💬"
                    title={isInvalidView ? 'Không có bình luận không hợp lệ' : 'Chưa có bình luận phù hợp'}
                    description={
                        isInvalidView
                            ? 'Hiện tại không phát hiện bình luận nào không hợp lệ theo gợi ý của hệ thống.'
                            : 'Thử thay đổi bộ lọc hoặc đợi thêm bình luận mới từ người dùng.'
                    }
                />
            );
        }

        return (
            <Table
                data={filteredComments}
                columns={tableColumns}
                keyField="id"
                className="category-table"
            />
        );
    };

    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-category-page">
                <div className="category-container">
                    <PageHeader
                        title="Quản lý bình luận"
                        description="Theo dõi và kiểm duyệt các bình luận để giữ môi trường học tập lành mạnh."
                        addButtonText="Làm mới dữ liệu"
                        addButtonLink="#"
                        containerClass="category-page-header"
                        headingClass="category-heading"
                        eyebrowClass="category-eyebrow"
                        buttonClass="category-btn primary"
                    />

                    {error && (
                        <ErrorAlert
                            message={error}
                            onRetry={() => setRefreshKey((prev: number) => prev + 1)}
                        />
                    )}

                    <Stats stats={stats} containerClass="category-stats" cardClass="category-stat-card" />

                    <div className="category-filters invalid-toggle-row">
                        <Filter
                            searchTerm=""
                            onSearchChange={() => { }}
                            filterValue={visibilityFilter}
                            onFilterChange={setVisibilityFilter}
                            onRefresh={() => setRefreshKey((prev: number) => prev + 1)}
                            placeholder=""
                            containerClass="category-filters-inner"
                            searchClass="d-none"
                            filterActionsClass="category-filter-actions"
                            filterChipClass="category-filter-chip"
                            buttonClass="category-btn ghost"
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

                    {renderTable()}
                </div>
            </div>
        </div>
    );
};

export default CommentList;