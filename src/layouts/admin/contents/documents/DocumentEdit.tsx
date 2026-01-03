import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDocumentById, hideDocument, changeStatusDocument } from '../../../../apis/DocumentApi';
import DocumentViewComp from '../../../common/components/DocumentViewComp';
import RightProperties from '../components/RightProperties';
import type { DocumentResponse } from '../../../../models/response/DocumentResponse';

const DocumentEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [document, setDocument] = useState<DocumentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        status: 'PENDING' as 'PENDING' | 'PUBLISHED',
        hide: false
    });

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getDocumentById(parseInt(id));
            if (data?.result) {
                const doc = data.result;
                setDocument(doc);
                setFormData({
                    status: doc.status || 'PENDING',
                    hide: doc.hide || false
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải tài liệu';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const handleStatusChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as 'PENDING' | 'PUBLISHED';
        setFormData(prev => ({ ...prev, status: newStatus }));

        if (!document?.id) return;

        setSaving(true);
        try {
            const response = await changeStatusDocument(document.id, {
                status: newStatus,
                updatedAt: new Date()
            });

            if (response?.resultList?.[0]) {
                setDocument(response.resultList[0]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [document?.id]);

    const handleHideChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHide = e.target.value === 'true';
        setFormData(prev => ({ ...prev, hide: newHide }));

        if (!document?.id) return;

        setSaving(true);
        try {
            const response = await hideDocument(document.id, { hide: newHide, updatedAt: new Date() });

            if (response?.resultList?.[0]) {
                setDocument(response.resultList[0]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật tính hiển thị';
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [document?.id]);

    if (loading) {
        return (
            <div className="admin-document-edit-page">
                <div className="document-container">
                    <div className="loading-skeleton">
                        <p>Đang tải tài liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="admin-document-edit-page">
                <div className="document-container">
                    <div className="error-state">
                        <p>Không tìm thấy tài liệu</p>
                        <button onClick={() => navigate('/documents')} className="document-btn primary">
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-document-edit-page">
            <div className="document-container">
                {/* Header */}
                <div className="document-edit-header">
                    <div className="document-header-content">
                        <button onClick={() => navigate('/documents')} className="document-back-btn">
                            <i className="fa fa-chevron-left" /> Quay lại
                        </button>
                        <div className="document-header-info">
                            <p className="document-eyebrow">Quản trị hệ thống</p>
                            <h1>Chi tiết tài liệu</h1>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="document-alert error">
                        <p>Lỗi: {error}</p>
                        <button type="button" onClick={fetchDocument} className="document-btn ghost">
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="document-edit-grid">
                    {/* Left: Document Preview */}
                    <div className="document-preview-section">
                        <div className="document-preview-card">
                            <h3 className="document-section-title">Xem trước tài liệu</h3>
                            <DocumentViewComp
                                fileUrl={`http://localhost:8080/api/documents/${document.id}/file`}
                                maxRenderWidth={860}
                                emptyFallback={
                                    <div className="document-empty-preview">
                                        <p>Không có tài liệu để hiển thị</p>
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    {/* Right: Document Properties */}
                    <RightProperties
                        basicInfo={[
                            { label: 'ID', value: document.id },
                            { label: 'Tiêu đề', value: document.title },
                            { label: 'Mô tả', value: document.description || '—' },
                            { label: 'Danh mục', value: document.categoryName || 'Chưa phân loại' },
                            { label: 'Người tải lên', value: document.userName }
                        ]}
                        stats={[
                            { label: 'Lượt xem', value: document.viewsCount ?? 0 },
                            { label: 'Lượt tải', value: document.downloadsCount ?? 0 }
                        ]}
                        status={formData.status}
                        onStatusChange={handleStatusChange}
                        hide={formData.hide}
                        onHideChange={handleHideChange}
                        createdAt={document.createdAt}
                        updatedAt={document.updatedAt}
                        onClose={() => navigate('/documents')}
                        saving={saving}
                        classPrefix="document"
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentEdit;