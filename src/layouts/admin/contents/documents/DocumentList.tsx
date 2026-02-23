import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDocument, deleteDocument, hideDocument } from '../../../../apis/DocumentApi';
import PageHeader from '../../components/PageHeader';
import Stats from '../../components/Stats';
import Filter from '../../components/Filter';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import LeftSidebar from '../../components/LeftSidebar';
import ConfirmDialog from '../../components/ConfirmDialog';
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
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; action: 'toggle' | 'delete'; item: DocumentResponse | null }>({ isOpen: false, action: 'toggle', item: null });

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
    }, [fetchDocuments]);

    const handleToggleVisibility = useCallback((document: DocumentResponse) => {
        setConfirmDialog({ isOpen: true, action: 'toggle', item: document });
    }, []);

    const handleDelete = useCallback((document: DocumentResponse) => {
        setConfirmDialog({ isOpen: true, action: 'delete', item: document });
    }, []);

    const handleConfirm = async () => {
        if (!confirmDialog.item) return;

        const { id } = confirmDialog.item;
        try {
            setUpdatingId(id);
            if (confirmDialog.action === 'toggle') {
                const { hide } = confirmDialog.item;
                await hideDocument(id, { hide: !hide, updatedAt: new Date() });
                setDocuments((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, hide: !hide } : item
                    )
                );
            } else {
                await deleteDocument(id);
                setDocuments((prev) => prev.filter((item) => item.id !== id));
            }
        } catch (err: any) {
            const message = handleApiError(err, confirmDialog.action === 'toggle' ? ERROR_MESSAGES.DOCUMENT_UPDATE_FAILED : ERROR_MESSAGES.DOCUMENT_DELETE_FAILED);
            setError(message);
        } finally {
            setUpdatingId(null);
            setConfirmDialog({ isOpen: false, action: 'toggle', item: null });
        }
    };

    const handleCancel = () => {
        setConfirmDialog({ isOpen: false, action: 'toggle', item: null });
    };

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
                        placeholder="Tìm kiếm theo tiêu đề hoặc mô tả…"
                        containerClass="document-filters"
                        searchClass="document-search"
                        filterActionsClass="document-filter-actions"
                        filterChipClass="document-filter-chip"
                    />

                    {loading && <LoadingState rows={5} variant="table" />}

                    {!loading && filteredDocuments.length === 0 && (
                        <EmptyState icon="📄" title="Chưa có tài liệu phù hợp" description="Thử thay đổi bộ lọc hoặc tải lên một tài liệu mới để phong phú thư viện tài nguyên." />
                    )}

                    {!loading && filteredDocuments.length > 0 && (
                        <div className="document-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Tiêu đề</th>
                                        <th>Mô tả</th>
                                        <th>Loại</th>
                                        <th>Trạng thái</th>
                                        <th className="text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDocuments.map((doc) => (
                                        <tr key={doc.id}>
                                            <td><span className="muted-cell">#{doc.id}</span></td>
                                            <td>
                                                <div>
                                                    <p className="document-title">{doc.title}</p>
                                                    <span className="document-meta">{doc.hide ? 'Ẩn khỏi công khai' : 'Công khai'}</span>
                                                </div>
                                            </td>
                                            <td><span className="description-cell">{doc.description || '—'}</span></td>
                                            <td><span>{doc.categoryName || 'Chưa phân loại'}</span></td>
                                            <td>{renderStatusPill(doc.status)}</td>
                                            <td className="text-right">
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
                    title="Xác nhận"
                    message={confirmDialog.action === 'toggle'
                        ? (confirmDialog.item.hide
                            ? `Bạn có muốn hiển thị lại tài liệu "${confirmDialog.item.title}"?`
                            : `Bạn có chắc chắn muốn ẩn tài liệu "${confirmDialog.item.title}"?`)
                        : `Bạn có chắc chắn muốn xóa tài liệu "${confirmDialog.item.title}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default DocumentList;
