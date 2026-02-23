import React, { memo } from "react";

interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
    return (
        <div className="error-alert">
            <div className="error-alert-icon">
                ⚠️
            </div>

            <div className="error-alert-content">
                <h4>Có lỗi xảy ra</h4>
                <p>{message}</p>
            </div>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="error-alert-btn"
                >
                    Thử lại
                </button>
            )}
        </div>
    );
};

export default memo(ErrorAlert);