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
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
            <h2 className="text-center mb-4">Upload Document</h2>

            <div style={{ color: "green", marginBottom: 12 }}>{successMsg}</div>

            {/* TITLE */}
            <div className="mb-3">
                <label className="form-label">Tiêu đề</label>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề"
                />
                <div style={{ color: "red" }}>{errTitle}</div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả"
                />
                <div style={{ color: "red" }}>{errDescription}</div>
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
                <label className="form-label">Category</label>

                <select
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                >
                    <option value="">-- Select category --</option>

                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* FILE */}
            <div className="mb-3">
                <label className="form-label">Chọn file(pdf,doc,docx,ppt,pptx)</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    ref={fileRef}
                />
                <div style={{ color: "red" }}>{errFile}</div>
            </div>

            <button
                type="button"
                onClick={handleUpload}
                className="btn btn-primary w-100"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : "Upload"}
            </button>

        </div >
    );
};

export default UploadDocument;
