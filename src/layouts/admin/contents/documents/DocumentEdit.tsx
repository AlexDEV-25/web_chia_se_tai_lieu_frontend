import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDocumentById, updateDocument } from "../../../../apis/DocumentApi";
import DocumentViewComp from "../../../common/components/DocumentViewComp";
import RightProperties from "../components/RightProperties";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";
import type { DocumentRequest } from "../../../../models/request/DocumentReques";
import { handleApiError } from "../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../constants/messages";
import ReturnHeader from "../components/ReturnHeader";
import ErrorAlert from "../../components/ErrorAlert";
import Header from "../components/Header";

const DocumentEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [document, setDocument] = useState<DocumentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"PENDING" | "PUBLISHED">("PENDING");
    const [hide, setHide] = useState(false);
    const [categoryId, setCategoryId] = useState<number | undefined>();

    const fetchDocument = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getDocumentById(parseInt(id, 10));
            const doc = response.result;
            setDocument(doc);
            setTitle(doc?.title ?? "");
            setDescription(doc?.description ?? "");
            setStatus(doc?.status ?? "PENDING");
            setHide(doc?.hide ?? false);
            setCategoryId(doc?.categoryId);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_LOAD_FAILED);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    const handleSave = useCallback(async () => {
        if (!document?.id) return;

        setSaving(true);
        try {
            const requestData: DocumentRequest = { title, description, status, hide, categoryId };
            const response = await updateDocument(document.id, requestData);
            setDocument(response.result);
            setError(null);
            navigate("/documents");
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_UPDATE_FAILED);
            setError(message);
        } finally {
            setSaving(false);
        }
    }, [document?.id, title, description, status, hide, categoryId]);

    if (loading) {
        return <div className="loading-skeleton">Đang tải tài liệu...</div>;
    }

    if (!document) {
        return (<ReturnHeader target="documents" content="Không tìm thấy tài liệu" />);
    }

    return (
        <div className="admin-document-edit-page">
            <div className="document-container">
                <Header target="documents" content="Chi tiết tài liệu" />

                {error && (<ErrorAlert message={error} onRetry={fetchDocument} />)}
                <div className="document-edit-grid">
                    <div className="document-preview-section">
                        <div className="document-preview-card">
                            <h3 className="document-section-title">Xem trước tài liệu</h3>
                            <DocumentViewComp
                                docId={document.id}
                                isAdmin={true}
                                isLessonDocument={false}
                                maxRenderWidth={860}
                                emptyFallback={
                                    <div className="document-empty-preview">
                                        <p>Không có tài liệu để hiển thị</p>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                    <RightProperties
                        type="document"
                        data={{
                            id: document.id,
                            title,
                            description,
                            categoryId,
                            status,
                            hide,
                            createdAt: document.createdAt,
                            updatedAt: document.updatedAt,
                            views: document.viewsCount,
                            downloads: document.downloadsCount,
                        }}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        setCategoryId={setCategoryId}
                        setStatus={setStatus}
                        setHide={setHide}
                        onSave={handleSave}
                        onClose={() => navigate("/documents")}
                        saving={saving}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentEdit;