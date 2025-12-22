import { useState } from "react";
import { updateMyLesson } from "../../../../apis/LessonApi";
import type { LessonResponse } from "../../../../models/response/LessonResponse";
import type { LessonRequest } from "../../../../models/request/LessonRequest";
import FormUpdate, { type FormDataType } from "./FormUpdate";
import DeleteAlert from "./DeleteAlert";

interface Props {
    lessons: LessonResponse[];
    onDelete: (id: number) => void;
    onUpdate: () => void;
}

const LessonComp: React.FC<Props> = ({ lessons, onDelete, onUpdate }) => {
    const [editingLesson, setEditingLesson] = useState<LessonResponse | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingLesson, setDeletingLesson] = useState<LessonResponse | null>(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleEdit = (lesson: LessonResponse) => {
        setEditingLesson(lesson);
        setShowEditForm(true);
    };

    const handleSaveEdit = async (data: FormDataType) => {
        if (!editingLesson) return;

        try {
            await updateMyLesson(editingLesson.id, data as LessonRequest);
            setShowEditForm(false);
            setEditingLesson(null);
            onUpdate();
        } catch (error) {
            console.error("Error updating lesson:", error);
            throw error;
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditingLesson(null);
    };

    const handleDelete = (lesson: LessonResponse) => {
        setDeletingLesson(lesson);
        setShowDeleteAlert(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingLesson) return;

        try {
            await onDelete(deletingLesson.id);
            setShowDeleteAlert(false);
            setDeletingLesson(null);
        } catch (error) {
            console.error("Error deleting lesson:", error);
            setShowDeleteAlert(false);
            setDeletingLesson(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteAlert(false);
        setDeletingLesson(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    if (lessons.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <i className="fa fa-play-circle"></i>
                </div>
                <h3>Chưa có bài học nào</h3>
                <p>Bạn chưa tải lên bài học nào. Hãy bắt đầu tải lên bài học đầu tiên của bạn!</p>
            </div>
        );
    }

    return (
        <>
            <div className="lesson-grid">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson-card">
                        <div className="lesson-thumbnail">
                            {lesson.thumbnailUrl ? (
                                <img src={`http://localhost:8080/api/images/thumbnail/${lesson.thumbnailUrl}`} alt={lesson.title} />
                            ) : (
                                <div className="default-thumbnail">
                                    <i className="fa fa-play-circle"></i>
                                </div>
                            )}
                            <div className="lesson-status">
                                <span className={`status-badge ${lesson.status.toLowerCase()}`}>
                                    {lesson.status === "PUBLISHED" ? "Đã xuất bản" : "Chờ duyệt"}
                                </span>
                            </div>
                            <div className="play-overlay">
                                <i className="fa fa-play"></i>
                            </div>
                        </div>

                        <div className="lesson-info">
                            <h3 className="lesson-title">{lesson.title}</h3>
                            <p className="lesson-description">
                                {lesson.description.length > 100
                                    ? `${lesson.description.substring(0, 100)}...`
                                    : lesson.description}
                            </p>

                            <div className="lesson-meta">
                                <div className="meta-item">
                                    <i className="fa fa-eye"></i>
                                    <span>{lesson.viewsCount}</span>
                                </div>
                                <div className="meta-item">
                                    <i className="fa fa-calendar"></i>
                                    <span>{formatDate(lesson.createdAt)}</span>
                                </div>
                            </div>

                            <div className="lesson-category">
                                <span className="category-tag">{lesson.categoryName}</span>
                            </div>

                            <div className="lesson-files">
                                {lesson.documentUrl && (
                                    <div className="file-indicator">
                                        <i className="fa fa-file-text"></i>
                                        <span>Tài liệu</span>
                                    </div>
                                )}
                                {lesson.subFileUrl && (
                                    <div className="file-indicator">
                                        <i className="fa fa-closed-captioning"></i>
                                        <span>Phụ đề</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lesson-actions">
                            <button
                                className="action-button edit"
                                onClick={() => handleEdit(lesson)}
                                title="Sửa bài học"
                            >
                                <i className="fa fa-edit"></i>
                                Sửa
                            </button>
                            <button
                                className="action-button delete"
                                onClick={() => handleDelete(lesson)}
                                title="Xóa bài học"
                            >
                                <i className="fa fa-trash"></i>
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showEditForm && editingLesson && (
                <FormUpdate
                    item={editingLesson}
                    itemType="lesson"
                    isVisible={showEditForm}
                    onClose={handleCancelEdit}
                    onSave={handleSaveEdit}
                />
            )}

            {showDeleteAlert && deletingLesson && (
                <DeleteAlert
                    isVisible={showDeleteAlert}
                    itemType="lesson"
                    itemName={deletingLesson.title}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default LessonComp;