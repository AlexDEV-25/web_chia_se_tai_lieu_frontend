import { useState, useEffect } from "react";
import { getMyDocument, deleteMyDocument } from "../../../apis/DocumentApi";
import { getMyLesson, deleteMyLesson } from "../../../apis/LessonApi";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import type { LessonResponse } from "../../../models/response/LessonResponse";
import DocumentComp from "./components/DocumentComp";
import LessonComp from "./components/LessonComp";
import axios from "axios";

const UploadHistory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"documents" | "lessons">("documents");
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (activeTab === "documents") {
                const response = await getMyDocument();
                setDocuments(response.resultList || []);
            } else {
                const response = await getMyLesson();
                setLessons(response.resultList || []);
            }
        } catch (err: any) {
            let message = "Không thể tải dữ liệu. Vui lòng thử lại.";
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
    };

    const handleDeleteDocument = async (id: number) => {
        if (!window.confirm("Bạn có muốn xóa tài liệu này không?")) {
            return;
        }

        try {
            await deleteMyDocument(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (err: any) {
            let message = "Xóa tài liệu thất bại. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            setError(message);
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
            let message = "Xóa bài học thất bại. Vui lòng thử lại.";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            setError(message);
        }
    };

    return (
        <div className="upload-history">
            <div className="upload-history-header">
                <h1>Lịch sử tải lên</h1>
                <div className="tab-navigation">
                    <button
                        className={`tab-button ${activeTab === "documents" ? "active" : ""}`}
                        onClick={() => setActiveTab("documents")}
                    >
                        Tài liệu ({documents.length})
                    </button>
                    <button
                        className={`tab-button ${activeTab === "lessons" ? "active" : ""}`}
                        onClick={() => setActiveTab("lessons")}
                    >
                        Bài học ({lessons.length})
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
                        {activeTab === "documents" && (
                            <DocumentComp
                                documents={documents}
                                onDelete={handleDeleteDocument}
                                onUpdate={loadData}
                            />
                        )}
                        {activeTab === "lessons" && (
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