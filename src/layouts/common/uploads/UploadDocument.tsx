import { useState, useEffect } from "react";
import type { DocumentRequest } from "./../../../models/request/DocumentReques";
import { getAllCategory } from "./../../../apis/CategoryApi";
import { uploadDocument } from "./../../../apis/DocumentApi";
import type { CategoryResponse } from "./../../../models/response/CategoryResponse";
import { useRef } from "react";
import axios from "axios";
const UploadDocument: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [categoryId, setCategoryId] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // Error states
    const [errTitle, setErrTitle] = useState("");
    const [errFile, setErrFile] = useState("");


    const [uploadMessage, setUploadMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategory();
                setCategories((response?.resultList ?? []).filter(cat => !cat.hide));
            } catch (err: any) {
                let message = "Không thể tải danh mục. Vui lòng thử lại.";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.message ??
                        err.message ??
                        message;
                }
                console.log(message);;
            }
        };
        fetchCategories();
    }, []);

    const handleUpload = async () => {
        if (isLoading) return;
        setIsLoading(true);

        let tErr = "";
        let fErr = "";


        if (title.trim() === "") tErr = "Tiêu đề không được để trống";
        if (!file) fErr = "Vui lòng chọn file";

        // Set errors
        setErrTitle(tErr);
        setErrFile(fErr);

        // Stop
        if (tErr || fErr) {
            setIsLoading(false);
            return;
        }
        const status: string = "PENDING";
        const doc: DocumentRequest = {
            title,
            description,
            status, hide: false,
            categoryId: categoryId === -1 ? undefined : categoryId
        };

        try {
            const response = await uploadDocument(file!, doc);

            console.log(response);
            setUploadMessage("Upload thành công!");

            // Reset form
            setTitle("");
            setDescription("");
            setFile(null);

            // Reset input file
            if (fileRef.current) { fileRef.current.value = ""; }

        } catch (err: any) {
            let message = "Upload thất bại!";
            if (axios.isAxiosError(err)) {
                message =
                    err.response?.data?.message ??
                    err.message ??
                    message;
            }
            setUploadMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="upload-shell">
            <section className="page-hero">
                <p className="eyebrow text-white-50">StudyShare · Upload</p>
                <h1>Upload Tài liệu</h1>
                <p>Chia sẻ tài liệu học tập với cộng đồng học viên.</p>
                <div className="page-actions">
                    <a href="/" className="pill-link">Xem tài liệu</a>
                </div>
            </section>

            <section className="glass-card">
                <div className="upload-grid">
                    <div className="upload-left">
                        <div className="input-field">
                            <label>Tiêu đề tài liệu</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Nhập tiêu đề tài liệu"
                            />
                            {errTitle && <span className="error-text">{errTitle}</span>}
                        </div>

                        <div className="input-field">
                            <label>Mô tả</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả nội dung tài liệu"
                                rows={4}
                            />
                        </div>

                        <div className="input-field">
                            <label>Danh mục</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                                <option key="-1" value="-1">Danh mục khác</option>
                            </select>
                        </div>
                    </div>

                    <div className="upload-right">
                        <div className="input-field">
                            <label>Tài liệu (pdf, doc, docx, ppt, pptx) *</label>
                            <div className="file-drop">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    ref={fileRef}
                                />
                                <i className="fa" />
                                <p>Kéo thả hoặc chọn file tài liệu</p>
                            </div>
                            {errFile && <span className="error-text">{errFile}</span>}
                        </div>

                        {uploadMessage && (
                            <div className={uploadMessage.includes("thành công") ? "success-text" : "error-text"}>
                                {uploadMessage}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleUpload}
                            className="btn-elevated"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Upload Tài Liệu"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UploadDocument;
