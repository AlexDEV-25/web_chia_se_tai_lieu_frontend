import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonById, updateLesson, deleteLesson } from "../../../../apis/LessonApi";
import VideoComp from "../../../common/components/VideoComp";
import DocumentViewComp from "../../../common/components/DocumentViewComp";
import RightProperties from "../components/RightProperties";
import type { LessonDetailResponse } from "../../../../models/response/lesson/LessonDetailResponse";
import type { LessonRequest } from "../../../../models/request/LessonRequest";
import { handleApiError } from "../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../constants/messages";
import ReturnHeader from "../components/ReturnHeader";
import ErrorAlert from "../../components/ErrorAlert";
import Header from "../components/Header";
import ConfirmDialog from "../../components/ConfirmDialog";
import type { ContentStatus } from "../../../../models/enum/common";

const LessonEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<LessonDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean }>({ isOpen: false });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<ContentStatus>("PENDING");
    const [hide, setHide] = useState(false);
    const [categoryId, setCategoryId] = useState<number | undefined>();

    const fetchLesson = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getLessonById(parseInt(id, 10));
            const les = response.result;

            setLesson(les);

            setTitle(les?.title ?? "");
            setDescription(les?.description ?? "");
            setStatus(les?.status ?? "PENDING");
            setHide(les?.hide ?? false);
            setCategoryId(les?.categoryId);
        } catch (err: any) {
            const message = handleApiError(
                err,
                ERROR_MESSAGES.LESSON_LOAD_FAILED
            );
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchLesson();
    }, [fetchLesson]);

    const handleSave = useCallback(async () => {
        if (!lesson?.id) return;

        setSaving(true);
        try {
            const requestData: LessonRequest = {
                title,
                description,
                status,
                hide,
                categoryId,
            };
            const response = await updateLesson(lesson.id, requestData);
            setLesson(response.result);
            setError(null);
            navigate("/lessons");
        } catch (err: any) {
            const message = handleApiError(
                err,
                ERROR_MESSAGES.LESSON_UPDATE_FAILED
            );
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [lesson?.id, title, description, status, categoryId]);

    const handleDelete = useCallback(async () => {
        if (!lesson?.id) return;

        setDeleting(true);
        try {
            await deleteLesson(lesson.id);
            setError(null);
            navigate("/lessons");
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DELETE_FAILED);
            setError(message);
            setConfirmDialog({ isOpen: false });
        } finally {
            setDeleting(false);
        }
    }, [lesson?.id]);

    if (loading) {
        return <div className="loading-skeleton">Đang tải bài học...</div>;
    }

    if (!lesson) {
        return (<ReturnHeader target="lessons" content="Không tìm thấy bài học" />);
    }

    return (
        <div className="admin-document-edit-page">
            <div className="document-container">
                <Header target="documents" content="Chi tiết bài học" />

                {error && (<ErrorAlert message={error} onRetry={fetchLesson} />)}
                <div className="document-actions-header">
                    <button
                        className="category-btn danger"
                        onClick={() => setConfirmDialog({ isOpen: true })}
                        disabled={deleting || saving}
                    >
                        {deleting ? 'Đang xóa...' : 'Xóa bài học'}
                    </button>
                </div>

                <div className="document-edit-grid">

                    <div className="document-preview-section">

                        <div className="document-preview-card">
                            <h3 className="document-section-title">Video bài giảng</h3>
                            <VideoComp videoUrl={lesson.lessonUrl} thumbnailUrl={lesson.thumbnailUrl} />
                        </div>

                        {lesson.documentUrl && (
                            <div className="document-preview-card">
                                <h3 className="document-section-title">Tài liệu bài giảng</h3>
                                <DocumentViewComp documentUrl={lesson.documentUrl} maxRenderWidth={860} emptyFallback={
                                    <div className="document-empty-preview">
                                        <p>Không có tài liệu đi kèm</p>
                                    </div>
                                } />
                            </div>
                        )}
                    </div>

                    <RightProperties
                        type="LESSON"
                        data={{
                            id: lesson.id,
                            title,
                            description,
                            categoryId,
                            status,
                            createdAt: lesson.createdAt,
                            updatedAt: lesson.updatedAt,
                            views: lesson.viewsCount,
                        }}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        setCategoryId={setCategoryId}
                        setStatus={setStatus}
                        onSave={handleSave}
                        onClose={() => navigate("/lessons")}
                        saving={saving}
                    />
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Xóa bài học"
                message={`Bạn có chắc chắn muốn xóa bài học "${lesson.title}"? Hành động này không thể hoàn tác.`}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDialog({ isOpen: false })}
                confirmText="Xóa"
                cancelText="Hủy"
            />
        </div>
    );
};

export default LessonEdit;