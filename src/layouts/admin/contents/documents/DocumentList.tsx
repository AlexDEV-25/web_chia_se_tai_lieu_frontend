import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDocument, deleteDocument, hideDocument } from '../../../../apis/DocumentApi';
import PageHeader from '../../components/PageHeader';
import Stats from '../../components/Stats';
import Filter from '../../components/Filter';
import Table from '../../components/Table';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import LeftSidebar from '../../components/LeftSidebar';
import type { DocumentResponse } from '../../../../models/response/DocumentResponse';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';

type VisibilityFilter = 'all' | 'visible' | 'hidden';

const DocumentList: React.FC = () => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllDocument();
            setDocuments(response?.resultList ?? []);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_LOAD_FAILED);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments, refreshKey]);

    const handleToggleVisibility = useCallback(async (document: DocumentResponse) => {
        const { id, title, hide } = document;
        const confirmMessage = hide
            ? `Bạn có muốn hiển thị lại tài liệu "${title}"?`
            : `Bạn có chắc chắn muốn ẩn tài liệu "${title}"?`;

        const confirmToggle = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            setUpdatingId(id);
            await hideDocument(id, {
                hide: !hide, updatedAt: new Date()
            });

            setDocuments((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: !hide } : item
                )
            );
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_UPDATE_FAILED);
            setError(message);
        } finally {
            setUpdatingId(null);
        }
    }, [documents]);

    const handleDelete = useCallback(async (document: DocumentResponse) => {
        const { id, title } = document;
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title}"? Hành động này không thể hoàn tác.`);
        if (!confirmDelete) return;

        try {
            setUpdatingId(id);
            await deleteDocument(id);
            setDocuments((prev) => prev.filter((item) => item.id !== id));
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_DELETE_FAILED);
            setError(message);
        } finally {
            setUpdatingId(null);
        }
    }, []);

    const filteredDocuments = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();
        return documents.filter((document) => {
            const matchesSearch =
                lowerSearch.length === 0 ||
                document.title.toLowerCase().includes(lowerSearch) ||
                document.description?.toLowerCase().includes(lowerSearch);
            const matchesVisibility =
                visibilityFilter === 'all' ||
                (visibilityFilter === 'visible' && !document.hide) ||
                (visibilityFilter === 'hidden' && document.hide);
            return matchesSearch && matchesVisibility;
        });
    }, [documents, searchTerm, visibilityFilter]);

    const stats = useMemo(() => {
        const total = documents.length;
        const hidden = documents.filter((doc) => doc.hide).length;
        const visible = total - hidden;
        return { total, visible, hidden };
    }, [documents]);

    const renderStatusPill = (status?: 'PENDING' | 'PUBLISHED') => {
        const isPublished = status === 'PUBLISHED';
        return (
            <span className={`document-status-pill ${isPublished ? 'is-published' : 'is-pending'}`}>
                {isPublished ? 'Đã duyệt' : 'Chờ duyệt'}
            </span>
        );
    };

    const tableColumns = [
        {
            key: 'id',
            header: 'Mã',
            render: (doc: DocumentResponse) => <span className="muted-cell">#{doc.id}</span>
        },
        {
            key: 'title',
            header: 'Tiêu đề',
            render: (doc: DocumentResponse) => (
                <div>
                    <p className="document-title">{doc.title}</p>
                    <span className="document-meta">{doc.hide ? 'Ẩn khỏi công khai' : 'Công khai'}</span>
                </div>
            )
        },
        {
            key: 'description',
            header: 'Mô tả',
            render: (doc: DocumentResponse) => <span className="description-cell">{doc.description || '—'}</span>
        },
        {
            key: 'categoryName',
            header: 'Loại',
            render: (doc: DocumentResponse) => <span>{doc.categoryName || 'Chưa phân loại'}</span>
        },
        {
            key: 'status',
            header: 'Trạng thái',
            render: (doc: DocumentResponse) => renderStatusPill(doc.status)
        },
        {
            key: 'actions',
            header: 'Thao tác',
            align: 'right' as const,
            render: (doc: DocumentResponse) => (
                <div className="document-row-actions">
                    <Link to={`/documents/edit/${doc.id}`} className="document-btn subtle">
                        Chi tiết
                    </Link>
                    <button
                        onClick={() => handleToggleVisibility(doc)}
                        disabled={updatingId === doc.id}
                        className={`document-btn ${doc.hide ? 'primary' : 'danger'}`}
                    >
                        {updatingId === doc.id ? 'Đang cập nhật...' : doc.hide ? 'Hiển thị' : 'Ẩn'}
                    </button>
                    <button
                        onClick={() => handleDelete(doc)}
                        disabled={updatingId === doc.id}
                        className="document-btn danger"
                    >
                        {updatingId === doc.id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-document-page">
                <div className="document-container">
                    <PageHeader
                        eyebrow="Quản trị hệ thống"
                        title="Quản lý tài liệu"
                        description="Theo dõi và quản lý các tài liệu đã tải lên để đảm bảo chất lượng nội dung."
                        addButtonText="Tải lên tài liệu"
                        addButtonLink="/documents/add"
                        containerClass="document-page-header"
                        headingClass="document-heading"
                        eyebrowClass="document-eyebrow"
                        buttonClass="document-btn primary"
                    />

                    {error && (
                        <ErrorAlert message={error} onRetry={fetchDocuments} />
                    )}

                    <Stats stats={stats} containerClass="document-stats" cardClass="document-stat-card" />

                    <Filter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterValue={visibilityFilter}
                        onFilterChange={setVisibilityFilter}
                        onRefresh={() => setRefreshKey((prev) => prev + 1)}
                        placeholder="Tìm kiếm theo tiêu đề hoặc mô tả…"
                        containerClass="document-filters"
                        searchClass="document-search"
                        filterActionsClass="document-filter-actions"
                        filterChipClass="document-filter-chip"
                        buttonClass="document-btn ghost"
                    />

                    {loading && <LoadingState />}

                    {!loading && filteredDocuments.length === 0 && (
                        <EmptyState icon="📄" title="Chưa có tài liệu phù hợp" description="Thử thay đổi bộ lọc hoặc tải lên một tài liệu mới để phong phú thư viện tài nguyên." />
                    )}

                    {!loading && filteredDocuments.length > 0 && (
                        <div className="document-table-wrapper">
                            <Table columns={tableColumns} data={filteredDocuments} keyField="id" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentList;
