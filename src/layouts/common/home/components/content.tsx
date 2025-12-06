import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { Document } from "./../../../../models/Document";
import { getAllDocument } from "../../../../apis/DocumentApi";
import type { DocumentResponse } from "../../../../models/response/DocumentResponse";




// Function Component Content
const Content: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]);

    const [documents, setDocuments] = useState<DocumentResponse[]>([]);


    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const documents = async () => {
            const data = await getAllDocument();
            setDocuments(data?.resultList ?? []);
            setLoading(false);
        }
        documents();
    }, [])
    // Hàm format ngày tiếng Việt - đẹp nhất
    const formatVietnameseDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleDateString("vi-VN");
    };

    if (loading) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-danger text-center mt-5">Lỗi: {error}</div>;
    return (
        <div className="container-fluid">
            <div className="row">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="col-12 col-md-9 col-lg-10 py-4">
                    <h3 className="mb-3">Danh sách tài liệu</h3>

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">

                        {documents.map(doc => (
                            <div className="col" key={doc.id}>
                                <div className="card h-100 shadow-sm">

                                    {/* Thumbnail */}
                                    <img
                                        src={doc.thumbnailUrl}
                                        className="card-img-top"
                                        alt={doc.title}
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />

                                    <div className="card-body d-flex flex-column">

                                        {/* Title */}
                                        <h5 className="card-title text-truncate">{doc.title}</h5>

                                        {/* Description */}
                                        <p className="card-text text-muted small text-truncate">
                                            {doc.description}
                                        </p>

                                        {/* View + Download stats */}
                                        <div className="d-flex justify-content-between mt-2">
                                            <span className="small text-secondary">
                                                👁 {doc.viewsCount}
                                            </span>
                                            <span className="small text-secondary">
                                                ⬇️ {doc.downloadsCount}
                                            </span>
                                        </div>

                                        <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                                            <button className="btn btn-sm btn-primary">Xem</button>

                                            <button
                                                className={`btn btn-sm ${favorites.includes(doc.id)
                                                    ? "btn-danger"
                                                    : "btn-outline-danger"
                                                    }`}
                                                onClick={() => toggleFavorite(doc.id)}
                                            >
                                                {favorites.includes(doc.id) ? "♥" : "♡"}
                                            </button>
                                        </div>

                                    </div>

                                    {/* Footer: Ngày tạo */}
                                    <div className="card-footer text-muted small">
                                        Ngày tạo: {doc.createdAt ? formatVietnameseDate(doc.createdAt) : "Không rõ"}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </main>

            </div>
        </div>
    );
};
export default Content;