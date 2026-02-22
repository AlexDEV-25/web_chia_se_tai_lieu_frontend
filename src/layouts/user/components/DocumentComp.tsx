import { useState } from "react";
import FormUpdate, { type FormDataType } from "./FormUpdate";
import DeleteAlert from "./DeleteAlert";
import type { DocumentResponse } from "../../../models/response/DocumentResponse";
import { updateMyDocument } from "../../../apis/DocumentApi";

import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import type { DocumentRequest } from "../../../models/request/DocumentReques";

interface Props {
    documents: DocumentResponse[];
    onDelete: (id: number) => void;
    onUpdate: () => void;
}

const DocumentComp: React.FC<Props> = ({ documents, onDelete, onUpdate }) => {
    const [editingDocument, setEditingDocument] = useState<DocumentResponse | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingDocument, setDeletingDocument] = useState<DocumentResponse | null>(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleEdit = (document: DocumentResponse) => {
        setEditingDocument(document);
        setShowEditForm(true);
    };

    const handleSaveEdit = async (data: FormDataType) => {
        if (!editingDocument) return;

        try {
            await updateMyDocument(editingDocument.id, data as DocumentRequest);
            setShowEditForm(false);
            setEditingDocument(null);
            onUpdate();
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DOCUMENT_UPDATE_FAILED_FORM);
            console.error(message);
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditingDocument(null);
    };

    const handleDelete = (document: DocumentResponse) => {
        setDeletingDocument(document);
        setShowDeleteAlert(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingDocument) return;

        try {
            onDelete(deletingDocument.id);
            setShowDeleteAlert(false);
            setDeletingDocument(null);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.DELETE_FAILED_FORM);
            console.error(message);
            setShowDeleteAlert(false);
            setDeletingDocument(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteAlert(false);
        setDeletingDocument(null);
    };

    if (documents.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <i className="fa fa-file-text"></i>
                </div>
                <h3>Chưa có tài liệu nào</h3>
                <p>Bạn chưa tải lên tài liệu nào. Hãy bắt đầu tải lên tài liệu đầu tiên của bạn!</p>
            </div>
        );
    }

    return (
        <>
            <div className="document-grid">
                {documents.map((document) => (
                    <div key={document.id} className="document-card">
                        <div className="document-thumbnail">
                            {document.thumbnailUrl ? (
                                <img src={`http://localhost:8080/api/images/thumbnail/${document.thumbnailUrl}`} alt={document.title} />
                            ) : (
                                <div className="default-thumbnail">
                                    <i className="fa fa-file-text"></i>
                                </div>
                            )}
                            <div className="document-status">
                                <span className={`status-badge ${document.status.toLowerCase()}`}>
                                    {document.status === "PUBLISHED" ? "Đã xuất bản" : "Chờ duyệt"}
                                </span>
                            </div>
                        </div>

                        <div className="document-info">
                            <h3 className="document-title">{document.title}</h3>
                            <p className="document-description">
                                {document.description.length > 100
                                    ? `${document.description.substring(0, 100)}...`
                                    : document.description}
                            </p>

                            <div className="document-meta">
                                <div className="meta-item">
                                    <i className="fa fa-eye"></i>
                                    <span>{document.viewsCount}</span>
                                </div>
                                <div className="meta-item">
                                    <i className="fa fa-download"></i>
                                    <span>{document.downloadsCount}</span>
                                </div>

                            </div>
                        </div>

                        <div className="document-action">
                            <button
                                className="action-button delete"
                                onClick={() => handleDelete(document)}
                                title="Xóa tài liệu"
                            >
                                <i className="fa fa-trash"></i>
                                Xóa
                            </button>
                            <button
                                className="action-button edit"
                                onClick={() => handleEdit(document)}
                                title="Sửa tài liệu"
                            >
                                <i className="fa fa-edit"></i>
                                Sửa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showEditForm && editingDocument && (
                <FormUpdate
                    item={editingDocument}
                    itemType="document"
                    isVisible={showEditForm}
                    onClose={handleCancelEdit}
                    onSave={handleSaveEdit}
                />
            )}

            {showDeleteAlert && deletingDocument && (
                <DeleteAlert
                    isVisible={showDeleteAlert}
                    itemType="document"
                    itemName={deletingDocument.title}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default DocumentComp;