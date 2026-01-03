import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLessonById, hideLesson, changeStatusLesson } from '../../../../apis/LessonApi';
import VideoComp from '../../../common/lesson_detail/components/VideoComp';
import DocumentViewComp from '../../../common/components/DocumentViewComp';
import RightProperties from '../components/RightProperties';
import type { LessonResponse } from '../../../../models/response/LessonResponse';

const LessonEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<LessonResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        status: 'PENDING' as 'PENDING' | 'PUBLISHED',
        hide: false
    });

    useEffect(() => {
        fetchLesson();
    }, [id]);

    const fetchLesson = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getLessonById(parseInt(id));
            if (data?.result) {
                const les = data.result;
                setLesson(les);
                setFormData({
                    status: les.status || 'PENDING',
                    hide: les.hide || false
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể tải bài học';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const handleStatusChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as 'PENDING' | 'PUBLISHED';
        setFormData(prev => ({ ...prev, status: newStatus }));

        if (!lesson?.id) return;

        setSaving(true);
        try {
            const response = await changeStatusLesson(lesson.id, {
                status: newStatus,
                updatedAt: new Date()
            });

            if (response?.result) {
                setLesson(response.result);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [lesson?.id]);

    const handleHideChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHide = e.target.value === 'true';
        setFormData(prev => ({ ...prev, hide: newHide }));

        if (!lesson?.id) return;

        setSaving(true);
        try {
            const response = await hideLesson(lesson.id, { hide: newHide, updatedAt: new Date() });

            if (response?.result) {
                setLesson(response.result);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật tính hiển thị';
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [lesson?.id]);

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
                            { label: 'ID', value: lesson.id },
                            { label: 'Tiêu đề', value: lesson.title },
                            { label: 'Mô tả', value: lesson.description || '—' },
                            { label: 'Danh mục', value: lesson.categoryName || 'Chưa phân loại' },
                            { label: 'Người dạy', value: lesson.userName }
                        ]}
                        stats={[
                            { label: 'Lượt xem', value: lesson.viewsCount ?? 0 }
                        ]}
                        status={formData.status}
                        onStatusChange={handleStatusChange}
                        hide={formData.hide}
                        onHideChange={handleHideChange}
                        createdAt={lesson.createdAt}
                        updatedAt={lesson.updatedAt}
                        onClose={() => navigate('/lessons')}
                        saving={saving}
                        classPrefix="document"
                    />
                </div>
            </div>
        </div>
    );
};

export default LessonEdit;