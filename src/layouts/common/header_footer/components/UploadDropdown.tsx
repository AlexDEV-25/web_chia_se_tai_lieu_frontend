import { Link } from "react-router-dom";

const UploadDropdown: React.FC = () => {
    return (
        <details className="upload-dropdown">
            <summary>
                Upload
                <i className="fa fa-chevron-down" />
            </summary>
            <div className="dropdown-content">
                <Link to="/uploadDocument">Upload Tài liệu</Link>
                <Link to="/uploadLesson">Upload Bài giảng</Link>
            </div>
        </details>
    );
};

export default UploadDropdown;
