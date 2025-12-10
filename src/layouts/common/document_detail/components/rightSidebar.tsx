import { Link } from "react-router-dom";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";

interface RightSidebarProps {
    relatedDocuments: DocumentResponse[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ relatedDocuments }) => {
    return (
        <div className="border rounded p-3 shadow-sm bg-white" style={{ maxHeight: "75vh", overflowY: "auto" }}>
            <h5 className="fw-bold mb-3">Gợi ý thêm</h5>

            {relatedDocuments.length === 0 && (
                <p className="text-muted">Chưa có tài liệu liên quan.</p>
            )}

            <div className="list-group">
                {relatedDocuments.map((item) => (
                    <Link
                        to={`/document/${item.id}`}
                        className="list-group-item list-group-item-action"
                        key={item.id}
                    >
                        <strong className="d-block">{item.title}</strong>
                        <small className="text-muted">{item.description}</small>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RightSidebar;