
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    target?: string;
    content?: string;
}

const Header: React.FC<Props> = ({ target, content }) => {
    const navigate = useNavigate();

    const targetPath = target ? `/${target}` : "/";

    return (
        <div className="document-edit-header">
            <div className="document-header-content">
                <button onClick={() => navigate(targetPath)} className="document-back-btn">
                    <i className="fa fa-chevron-left" /> Quay lại
                </button>
                <div className="document-header-info">
                    <p className="document-eyebrow">Quản trị hệ thống</p>
                    <h1>{content}</h1>
                </div>
            </div>
        </div>

    );
};

export default Header;