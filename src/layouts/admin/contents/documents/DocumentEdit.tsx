import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDocumentById, updateDocument } from '../../../../apis/DocumentApi';
import DocumentViewComp from '../../../common/components/DocumentViewComp';
import RightProperties from '../components/RightProperties';
import type { DocumentResponse } from '../../../../models/response/DocumentResponse';
import type { DocumentRequest } from '../../../../models/request/DocumentReques';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';

const DocumentEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [document, setDocument] = useState<DocumentResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const [formData, setFormData] = useState<DocumentRequest>({
        title: '',
        description: '',
        status: 'PENDING' as 'PENDING' | 'PUBLISHED',
        hide: false,
        categoryId: undefined
    });

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getDocumentById(parseInt(id));
            const doc = response.result;
            setDocument(doc);
            setFormData({
                title: doc?.title || '',
                description: doc?.description || '',
                status: doc?.status || 'PENDING',
                hide: doc?.hide || false,
                categoryId: doc?.categoryId
            });
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_LOAD_FAILED);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as 'PENDING' | 'PUBLISHED';
        setFormData(prev => ({ ...prev, status: newStatus }));
    }, []);

    const handleHideChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHide = e.target.value === 'true';
        setFormData(prev => ({ ...prev, hide: newHide }));
    }, []);

    const handleTitleChange = useCallback((value: string | number | undefined) => {
        setFormData(prev => ({ ...prev, title: String(value || '') }));
    }, []);

    const handleDescriptionChange = useCallback((value: string | number | undefined) => {
        setFormData(prev => ({ ...prev, description: String(value || '') }));
    }, []);

    const handleCategoryIdChange = useCallback((value: string | number | undefined) => {
        setFormData(prev => ({ ...prev, categoryId: value ? Number(value) : undefined }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!document?.id) return;

        setSaving(true);
        try {
            const response = await updateDocument(document.id, formData);
            setDocument(response.result);
            setError(null);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_UPDATE_FAILED);
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [document?.id, formData]);

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
                                fileUrl={`http://localhost:8080/api/documents/admin/${document.id}/file`}
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
                            { label: 'ID', value: document.id, editable: false },
                            { label: 'Tiêu đề', value: formData.title, editable: true, onChange: handleTitleChange },
                            { label: 'Mô tả', value: formData.description, editable: true, onChange: handleDescriptionChange },
                            { label: 'Danh mục', value: formData.categoryId || document.categoryName, editable: true, onChange: handleCategoryIdChange, isCategory: true, currentCategoryName: document.categoryName },
                            { label: 'Người tải lên', value: document.userName, editable: false }
                        ]}
                        stats={[
                            { label: 'Lượt xem', value: document.viewsCount ?? 0 },
                            { label: 'Lượt tải', value: document.downloadsCount ?? 0 }
                        ]}
                        status={formData.status as 'PENDING' | 'PUBLISHED'}
                        onStatusChange={handleStatusChange}
                        hide={formData.hide}
                        onHideChange={handleHideChange}
                        createdAt={document.createdAt}
                        updatedAt={document.updatedAt}
                        onClose={() => navigate('/documents')}
                        onSave={handleSave}
                        saving={saving}
                        classPrefix="document"
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentEdit;