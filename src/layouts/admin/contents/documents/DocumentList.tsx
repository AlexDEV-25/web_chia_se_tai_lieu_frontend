import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDocument, updateDocument, deleteDocument } from '../../../../apis/DocumentApi';

import type { DocumentResponse } from '../../../../models/response/DocumentResponse';
// import '../../../../styles/pages/_documents.css';

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
            const data = await getAllDocument();
            setDocuments(data?.resultList ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải tài liệu';
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
            await updateDocument(id, {
                title,
                description: document.description ?? '',
                hide: !hide
            });
            setDocuments((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: !hide } : item
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái tài liệu.';
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
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể xóa tài liệu.';
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

    const renderStatusPill = (isHidden: boolean) => (
        <span className={`document-status-pill ${isHidden ? 'is-hidden' : 'is-visible'}`}>
            {isHidden ? 'Đang ẩn' : 'Đang hiển thị'}
        </span>
    );

    const renderTable = () => {
        if (loading) {
            return (
                <div className="document-card">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="document-loading-row" />
                    ))}
                </div>
            );
        }

        if (!loading && filteredDocuments.length === 0) {
            return (
                <div className="document-empty-state">
                    <div className="empty-icon">📄</div>
                    <p className="empty-title">Chưa có tài liệu phù hợp</p>
                    <p className="empty-desc">
                        Thử thay đổi bộ lọc hoặc tải lên một tài liệu mới để phong phú thư viện tài nguyên.
                    </p>
                </div>
            );
        }

        return (
            <div className="document-table-wrapper">
                <table className="document-table">
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
                                <td className="muted-cell">#{doc.id}</td>
                                <td>
                                    <p className="document-title">{doc.title}</p>
                                    <span className="document-meta">
                                        {doc.hide ? 'Ẩn khỏi công khai' : 'Công khai'}
                                    </span>
                                </td>
                                <td className="description-cell">{doc.description || '—'}</td>
                                <td>{doc.categoryName || 'Chưa phân loại'}</td>
                                <td>{renderStatusPill(doc.hide)}</td>
                                <td>
                                    <div className="document-row-actions">
                                        <Link
                                            to={`/documents/edit/${doc.id}`}
                                            className="document-btn subtle"
                                        >
                                            Chỉnh sửa
                                        </Link>
                                        <button
                                            onClick={() => handleToggleVisibility(doc)}
                                            disabled={updatingId === doc.id}
                                            className={`document-btn ${doc.hide ? 'primary' : 'danger'}`}
                                        >
                                            {updatingId === doc.id
                                                ? 'Đang cập nhật...'
                                                : doc.hide
                                                    ? 'Hiển thị'
                                                    : 'Ẩn'}
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
        );
    };

    return (
        <div className="admin-document-page">
            <div className="document-container">
                <div className="document-page-header">
                    <div className="document-heading">
                        <p className="document-eyebrow">Quản trị hệ thống</p>
                        <h1>Quản lý tài liệu</h1>
                        <p>Theo dõi và quản lý các tài liệu đã tải lên để đảm bảo chất lượng nội dung.</p>
                    </div>
                    <Link to="/documents/add" className="document-btn primary">
                        Tải lên tài liệu
                    </Link>
                </div>

                {error && (
                    <div className="document-alert error">
                        <p>Lỗi: {error}</p>
                        <button type="button" onClick={fetchDocuments} className="document-btn ghost">
                            Thử lại
                        </button>
                    </div>
                )}

                <div className="document-stats">
                    <div className="document-stat-card">
                        <span className="stat-label">Tổng tài liệu</span>
                        <strong className="stat-value">{stats.total}</strong>
                        <p className="stat-desc">Tất cả tài liệu đang có</p>
                    </div>
                    <div className="document-stat-card positive">
                        <span className="stat-label">Đang hiển thị</span>
                        <strong className="stat-value">{stats.visible}</strong>
                        <p className="stat-desc">Công khai cho người dùng</p>
                    </div>
                    <div className="document-stat-card warning">
                        <span className="stat-label">Đang ẩn</span>
                        <strong className="stat-value">{stats.hidden}</strong>
                        <p className="stat-desc">Chờ được công bố</p>
                    </div>
                </div>

                <div className="document-filters">
                    <div className="document-search">
                        <i className="fa fa-search" aria-hidden="true" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tiêu đề hoặc mô tả…"
                        />
                    </div>
                    <div className="document-filter-actions">
                        {(['all', 'visible', 'hidden'] as VisibilityFilter[]).map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setVisibilityFilter(filter)}
                                className={`document-filter-chip ${visibilityFilter === filter ? 'is-active' : ''}`}
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
                            className="document-btn ghost"
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

export default DocumentList;
