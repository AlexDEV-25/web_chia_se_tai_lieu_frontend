import { useState, useEffect, useCallback } from "react";
import { getMyDocument, deleteMyDocument, countMyDocument } from "../../../apis/DocumentApi";
import { getMyLesson, deleteMyLesson, countMyLesson } from "../../../apis/LessonApi";
import type { DocumentUserResponse } from "../../../models/response/document/DocumentUserResponse";
import type { LessonUserResponse } from "../../../models/response/lesson/LessonUserResponse";
import DocumentComp from "./DocumentComp";
import LessonComp from "./LessonComp";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import type { InteractionType } from "../../../models/enum/common";

const UploadHistory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<InteractionType>("DOCUMENT");
    const [documents, setDocuments] = useState<DocumentUserResponse[]>([]);
    const [lessons, setLessons] = useState<LessonUserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [documentQuantity, setDocumentQuantity] = useState<number>(0);
    const [lessonQuantity, setLessonQuantity] = useState<number>(0);

    const handleSelectDocumentTab = useCallback(() => setActiveTab("DOCUMENT"), []);
    const handleSelectLessonTab = useCallback(() => setActiveTab("LESSON"), []);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (activeTab === "DOCUMENT") {
                const response = await getMyDocument();
                setDocuments(response.resultList || []);
            } else {
                const response = await getMyLesson();
                setLessons(response.resultList || []);
            }
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.UPLOAD_HISTORY_LOAD_FAILED));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async (id: number) => {
        try {
            await deleteMyDocument(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.DOCUMENT_DELETE_FAILED));
        }
    };

    const handleDeleteLesson = async (id: number) => {
        if (!window.confirm("Bạn có muốn xóa bài học này không?")) {
            return;
        }

        try {
            await deleteMyLesson(id);
            setLessons(prev => prev.filter(lesson => lesson.id !== id));
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.LESSON_DELETE_FAILED));
        }
    };

    const fetchCountMyDocument = async () => {
        try {
            const response = await countMyDocument();
            setDocumentQuantity(response?.result || 0);
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.COUNT_DOCUMENT_ERROR))
        }
    };
    const fetchCountMyLesson = async () => {
        try {
            const response = await countMyLesson();
            setLessonQuantity(response?.result || 0);
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.COUNT_LESSON_ERROR))
        }
    };

    useEffect(() => {
        const CountDocumentAndLesson = async () => {
            setLoading(true);
            await Promise.all([
                fetchCountMyDocument(),
                fetchCountMyLesson(),
            ]);
        };
        CountDocumentAndLesson();
    }, []);

    return (
        <div className="upload-history">
            <div className="upload-history-header">
                <h1>Lịch sử tải lên</h1>
                <div className="tab-navigation">
                    <button
                        className={`tab-button ${activeTab === "DOCUMENT" ? "active" : ""}`}
                        onClick={handleSelectDocumentTab}
                    >
                        Tài liệu ({documentQuantity})
                    </button>
                    <button
                        className={`tab-button ${activeTab === "LESSON" ? "active" : ""}`}
                        onClick={handleSelectLessonTab}
                    >
                        Bài học ({lessonQuantity})
                    </button>
                </div>
            </div>

            <div className="upload-history-content">
                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={loadData}>Thử lại</button>
                    </div>
                )}

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === "DOCUMENT" && (
                            <DocumentComp
                                documents={documents}
                                onDelete={handleDeleteDocument}
                                onUpdate={loadData}
                            />
                        )}
                        {activeTab === "LESSON" && (
                            <LessonComp
                                lessons={lessons}
                                onDelete={handleDeleteLesson}
                                onUpdate={loadData}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadHistory;