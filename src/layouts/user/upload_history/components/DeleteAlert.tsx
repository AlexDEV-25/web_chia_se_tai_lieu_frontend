import axios from "axios";
import { useState } from "react";

interface Props {
    isVisible: boolean;
    itemType: "document" | "lesson";
    itemName: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

const DeleteAlert: React.FC<Props> = ({
    isVisible,
    itemType,
    itemName,
    onConfirm,
    onCancel
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (err: any) {
            let message = "Xóa thất bại!";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            console.error(message);
            setIsDeleting(false);
        }
    };

    const getAlertTitle = () => {
        return itemType === "document" ? "Xóa tài liệu" : "Xóa bài học";
    };

    const getAlertMessage = () => {
        const prefix = itemType === "document" ? "tài liệu" : "bài học";
        return `Bạn có chắc chắn muốn xóa ${prefix} "${itemName}" không? Hành động này không thể hoàn tác.`;
    };

    const getAlertIcon = () => {
        return itemType === "document" ? "fa-file-text" : "fa-play-circle";
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content delete-alert-modal">
                <div className="delete-alert-header">
                    <div className="alert-icon danger">
                        <i className="fa fa-exclamation-triangle"></i>
                    </div>
                    <div className="alert-title-section">
                        <div className="item-icon">
                            <i className={`fa ${getAlertIcon()}`}></i>
                        </div>
                        <h3>{getAlertTitle()}</h3>
                    </div>
                    <button className="close-button" onClick={onCancel} disabled={isDeleting}>
                        <i className="fa fa-times"></i>
                    </button>
                </div>

                <div className="delete-alert-body">
                    <div className="alert-message">
                        <i className="fa fa-info-circle"></i>
                        <p>{getAlertMessage()}</p>
                    </div>

                    <div className="warning-details">
                        <div className="warning-item">
                            <i className="fa fa-shield-alt"></i>
                            <span>Tất cả dữ liệu liên quan sẽ bị mất</span>
                        </div>
                        <div className="warning-item">
                            <i className="fa fa-users"></i>
                            <span>Người dùng đã truy cập sẽ không còn thấy nội dung này</span>
                        </div>
                        <div className="warning-item">
                            <i className="fa fa-history"></i>
                            <span>Hành động này không thể khôi phục</span>
                        </div>
                    </div>
                </div>

                <div className="delete-alert-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        <i className="fa fa-times"></i>
                        Hủy
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <i className="fa fa-spinner fa-spin"></i>
                                Đang xóa...
                            </>
                        ) : (
                            <>
                                <i className="fa fa-trash"></i>
                                Xóa {itemType === "document" ? "tài liệu" : "bài học"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAlert;