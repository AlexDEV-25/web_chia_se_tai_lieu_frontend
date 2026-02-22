import { useState } from "react";

import FormUpdate, { type FormDataType } from "./FormUpdate";
import DeleteAlert from "./DeleteAlert";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import { updateMyLesson } from "../../../apis/LessonApi";
import type { LessonRequest } from "../../../models/request/LessonRequest";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";

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
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.LESSON_UPDATE_FAILED_FORM);
            console.error(message);
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
            onDelete(deletingLesson.id);
            setShowDeleteAlert(false);
            setDeletingLesson(null);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DELETE_FAILED_FORM);
            console.error(message);
            setShowDeleteAlert(false);
            setDeletingLesson(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteAlert(false);
        setDeletingLesson(null);
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
                            </div>
                        </div>

                        <div className="lesson-action">
                            <button
                                className="action-button delete"
                                onClick={() => handleDelete(lesson)}
                                title="Xóa bài học"
                            >
                                <i className="fa fa-trash"></i>
                                Xóa
                            </button>
                            <button
                                className="action-button edit"
                                onClick={() => handleEdit(lesson)}
                                title="Sửa bài học"
                            >
                                <i className="fa fa-edit"></i>
                                Sửa
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