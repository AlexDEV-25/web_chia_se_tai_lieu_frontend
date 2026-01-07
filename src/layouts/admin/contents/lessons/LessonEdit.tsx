import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLessonById, updateLesson } from '../../../../apis/LessonApi';
import VideoComp from '../../../common/lesson_detail/components/VideoComp';
import DocumentViewComp from '../../../common/components/DocumentViewComp';
import RightProperties from '../components/RightProperties';
import type { LessonResponse } from '../../../../models/response/LessonResponse';
import type { LessonRequest } from '../../../../models/request/LessonRequest';
import axios from 'axios';

const LessonEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<LessonResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const [formData, setFormData] = useState<LessonRequest>({
        title: '',
        description: '',
        status: 'PENDING' as 'PENDING' | 'PUBLISHED',
        hide: false,
        categoryId: undefined
    });

    useEffect(() => {
        fetchLesson();
    }, [id]);

    const fetchLesson = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getLessonById(parseInt(id));
            const les = response.result;
            setLesson(les);
            setFormData({
                title: les?.title || '',
                description: les?.description || '',
                status: les?.status || 'PENDING',
                hide: les?.hide || false,
                categoryId: les?.categoryId
            });
        } catch (err: any) {
            let message = "Không thể tải tài liệu. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
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
        if (!lesson?.id) return;

        setSaving(true);
        try {
            const response = await updateLesson(lesson.id, formData);
            setLesson(response.result);
            setError(null);
        } catch (err: any) {
            let message = "Không thể cập nhật bài học. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [lesson?.id, formData]);

    if (loading) {
        return (
            <div className="admin-document-edit-page">
                <div className="document-container">
                    <div className="loading-skeleton">
                        <p>Đang tải bài học...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="admin-document-edit-page">
                <div className="document-container">
                    <div className="error-state">
                        <p>Không tìm thấy bài học</p>
                        <button onClick={() => navigate('/lessons')} className="document-btn primary">
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
                        <button onClick={() => navigate('/lessons')} className="document-back-btn">
                            <i className="fa fa-chevron-left" /> Quay lại
                        </button>
                        <div className="document-header-info">
                            <p className="document-eyebrow">Quản trị hệ thống</p>
                            <h1>Chi tiết bài học</h1>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="document-alert error">
                        <p>Lỗi: {error}</p>
                        <button type="button" onClick={fetchLesson} className="document-btn ghost">
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="document-edit-grid">
                    {/* Left: Video & Document Preview */}
                    <div className="document-preview-section">
                        {/* Video Section */}
                        <div className="document-preview-card">
                            <h3 className="document-section-title">Video bài giảng</h3>
                            <VideoComp
                                lessonId={lesson.id}
                                thumbnailUrl={lesson.thumbnailUrl}
                            />
                        </div>

                        {/* Document Section */}
                        {lesson.documentUrl && (
                            <div className="document-preview-card">
                                <h3 className="document-section-title">Tài liệu bài giảng</h3>
                                <DocumentViewComp
                                    fileUrl={`http://localhost:8080/api/lessons/${lesson.id}/document`}
                                    maxRenderWidth={860}
                                    emptyFallback={
                                        <div className="document-empty-preview">
                                            <p>Không có tài liệu đi kèm</p>
                                        </div>
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Lesson Properties */}
                    <RightProperties
                        basicInfo={[
                            { label: 'ID', value: lesson.id, editable: false },
                            { label: 'Tiêu đề', value: formData.title, editable: true, onChange: handleTitleChange },
                            { label: 'Mô tả', value: formData.description, editable: true, onChange: handleDescriptionChange },
                            { label: 'Danh mục', value: formData.categoryId || lesson.categoryName, editable: true, onChange: handleCategoryIdChange, isCategory: true, currentCategoryName: lesson.categoryName },
                            { label: 'Người dạy', value: lesson.userName, editable: false }
                        ]}
                        stats={[
                            { label: 'Lượt xem', value: lesson.viewsCount ?? 0 }
                        ]}
                        status={formData.status as 'PENDING' | 'PUBLISHED'}
                        onStatusChange={handleStatusChange}
                        hide={formData.hide}
                        onHideChange={handleHideChange}
                        createdAt={lesson.createdAt}
                        updatedAt={lesson.updatedAt}
                        onClose={() => navigate('/lessons')}
                        onSave={handleSave}
                        saving={saving}
                        classPrefix="document"
                    />
                </div>
            </div>
        </div>
    );
};

export default LessonEdit;