import { useState, useEffect } from "react";
import api from "./../../../apis/HttpClient";
import type { DocumentRequest } from "./../../../models/request/DocumentReques";
import { getAllCategory } from "./../../../apis/CategoryApi";
import { Category } from "./../../../models/Category";
import { useRef } from "react";
const UploadDocument: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // Error states
    const [errTitle, setErrTitle] = useState("");
    const [errDescription, setErrDescription] = useState("");
    const [errFile, setErrFile] = useState("");


    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const categories = async () => {
            const data = await getAllCategory();
            setCategories(data?.resultList ?? []);
        }
        categories().catch(error => {
            console.log(error);
        });
    }, []);

    const handleUpload = async () => {
        if (isLoading) return;
        setIsLoading(true);

        let tErr = "";
        let dErr = "";
        let fErr = "";


        if (title.trim() === "") tErr = "Tiêu đề không được để trống";
        if (description.trim() === "") dErr = "Mô tả không được để trống";
        if (!file) fErr = "Vui lòng chọn file";

        // Set errors
        setErrTitle(tErr);
        setErrDescription(dErr);
        setErrFile(fErr);

        // Stop
        if (tErr || dErr || fErr) {
            setIsLoading(false);
            return;
        }
        const status: string = "PENDING";
        const doc: DocumentRequest = { title, description, viewsCount: 0, downloadsCount: 0, status, hide: false, categoryId, };

        // ================= FORM DATA =================
        const formData = new FormData();
        formData.append("file", file!);
        formData.append("data", JSON.stringify(doc));

        try {
            const res = await api.post("/documents/upload-file", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(res.data);
            setSuccessMsg("Upload thành công!");

            // Reset form
            setTitle("");
            setDescription("");
            // 👉 Reset input file
            if (fileRef.current) {
                fileRef.current.value = "";
            }

        } catch (err) {
            console.error(err);
            setSuccessMsg("Upload thất bại!");
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
                            {errDescription && <span className="error-text">{errDescription}</span>}
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

                        {successMsg && (
                            <div className={successMsg.includes("thành công") ? "success-text" : "error-text"}>
                                {successMsg}
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
