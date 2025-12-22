import { useState } from "react";
import { updateMyDocument } from "../../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";
import type { DocumentRequest } from "../../../../models/request/DocumentReques";
import FormUpdate, { type FormDataType } from "./FormUpdate";
import DeleteAlert from "./DeleteAlert";

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
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
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
            await onDelete(deletingDocument.id);
            setShowDeleteAlert(false);
            setDeletingDocument(null);
        } catch (error) {
            console.error("Error deleting document:", error);
            setShowDeleteAlert(false);
            setDeletingDocument(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteAlert(false);
        setDeletingDocument(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
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
                                <div className="meta-item">
                                    <i className="fa fa-calendar"></i>
                                    <span>{formatDate(document.createdAt)}</span>
                                </div>
                            </div>

                            <div className="document-category">
                                <span className="category-tag">{document.categoryName}</span>
                            </div>
                        </div>

                        <div className="document-actions">
                            <button
                                className="action-button edit"
                                onClick={() => handleEdit(document)}
                                title="Sửa tài liệu"
                            >
                                <i className="fa fa-edit"></i>
                                Sửa
                            </button>
                            <button
                                className="action-button delete"
                                onClick={() => handleDelete(document)}
                                title="Xóa tài liệu"
                            >
                                <i className="fa fa-trash"></i>
                                Xóa
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