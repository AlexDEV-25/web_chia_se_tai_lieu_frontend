import React, { memo } from 'react';

interface ErrorAlertProps {
    message: string;
    onRetry: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
    return (
        <div className="alert error">
            <p>Lỗi: {message}</p>
            <button type="button" onClick={onRetry} className="btn ghost">
                Thử lại
            </button>
        </div>
    );
};

export default memo(ErrorAlert);
