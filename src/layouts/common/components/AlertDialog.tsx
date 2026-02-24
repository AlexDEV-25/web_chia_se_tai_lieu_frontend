import React, { memo } from 'react';
import ReactDOM from 'react-dom';

interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    okText?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    title,
    message,
    onClose,
    okText = 'OK'
}) => {
    if (!isOpen) return null;

    const modalContent = (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="close" onClick={onClose} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={onClose}>{okText}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default memo(AlertDialog);