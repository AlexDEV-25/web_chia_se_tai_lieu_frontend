import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    target?: string;
    content?: string;
}

const ReturnHeader: React.FC<Props> = ({ target, content }) => {
    const navigate = useNavigate();

    const targetPath = target ? `/${target}` : "/";

    return (
        <div className="error-state">
            <p>{content}</p>
            <button
                onClick={() => navigate(targetPath)}
                className="document-btn primary"
            >
                Quay lại
            </button>
        </div>
    );
};

export default ReturnHeader;