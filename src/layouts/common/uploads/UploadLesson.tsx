import { useState, useEffect } from "react";
import type { LessonRequest } from "./../../../models/request/LessonRequest";
import { getAllCategory } from "./../../../apis/CategoryApi";
import { uploadLesson } from "./../../../apis/LessonApi";
import type { CategoryResponse } from "./../../../models/response/CategoryResponse";
import { useRef } from "react";

const UploadLesson: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [categoryId, setCategoryId] = useState(1);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [subFile, setSubFile] = useState<File | null>(null);
    const videoRef = useRef<HTMLInputElement | null>(null);
    const documentRef = useRef<HTMLInputElement | null>(null);
    const subFileRef = useRef<HTMLInputElement | null>(null);

    // Error states
    const [errTitle, setErrTitle] = useState("");
    const [errVideo, setErrVideo] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategory();
            setCategories(data?.resultList ?? []);
        };
        fetchCategories().catch(error => {
            console.log(error);
        });
    }, []);

    const handleUpload = async () => {
        if (isLoading) return;
        setIsLoading(true);

        let tErr = "";
        let vErr = "";

        if (title.trim() === "") tErr = "Tiêu đề không được để trống";
        if (!videoFile) vErr = "Vui lòng chọn file video";

        // Set errors
        setErrTitle(tErr);
        setErrVideo(vErr);

        // Stop
        if (tErr || vErr) {
            setIsLoading(false);
            return;
        }

        const status: string = "PENDING";
        const lesson: LessonRequest = {
            title,
            description,
            status,
            hide: false,
            categoryId: categoryId === -1 ? undefined : categoryId
        };

        try {
            const res = await uploadLesson(videoFile!, lesson, documentFile || undefined, subFile || undefined);

            console.log(res);
            setSuccessMsg("Upload bài giảng thành công!");

            // Reset form
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setDocumentFile(null);
            setSubFile(null);

            // Reset input files
            if (videoRef.current) videoRef.current.value = "";
            if (documentRef.current) documentRef.current.value = "";
            if (subFileRef.current) subFileRef.current.value = "";

        } catch (err) {
            console.error(err);
            setSuccessMsg("Upload bài giảng thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="upload-shell">
            <section className="page-hero">
                <p className="eyebrow text-white-50">StudyShare · Upload</p>
                <h1>Upload Bài giảng Video</h1>
                <p>Chia sẻ kiến thức với cộng đồng qua video bài giảng và tài liệu đi kèm.</p>
                <div className="page-actions">
                    <a href="/lesson" className="pill-link">Xem bài giảng</a>
                </div>
            </section>

            <section className="glass-card">
                <div className="upload-grid-three">
                    <div className="upload-column">
                        <div className="input-field">
                            <label>Tiêu đề bài giảng</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Nhập tiêu đề bài giảng"
                            />
                            {errTitle && <span className="error-text">{errTitle}</span>}
                        </div>

                        <div className="input-field">
                            <label>Mô tả</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả nội dung bài giảng"
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

                    <div className="upload-column">
                        <div className="input-field">
                            <label>Video bài giảng (mp4) *</label>
                            <div className="file-drop">
                                <input
                                    type="file"
                                    accept=".mp4"
                                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                    ref={videoRef}
                                />
                                <i className="fa fa-video" />
                                <p>Kéo thả hoặc chọn file video (.mp4)</p>
                            </div>
                            {errVideo && <span className="error-text">{errVideo}</span>}
                        </div>

                        <div className="input-field">
                            <label>Tài liệu đi kèm (pdf, doc, docx, ppt, pptx) - Tùy chọn</label>
                            <div className="file-drop">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                                    ref={documentRef}
                                />
                                <i className="fa" />
                                <p>Kéo thả hoặc chọn file tài liệu</p>
                            </div>
                        </div>
                    </div>

                    <div className="upload-column">
                        <div className="input-field">
                            <label>Tài liệu bổ sung (rar) - Tùy chọn</label>
                            <div className="file-drop">
                                <input
                                    type="file"
                                    accept=".rar"
                                    onChange={(e) => setSubFile(e.target.files?.[0] || null)}
                                    ref={subFileRef}
                                />
                                <i className="fa" />
                                <p>Kéo thả hoặc chọn file RAR</p>
                            </div>
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
                            {isLoading ? "Đang xử lý..." : "Upload Bài Giảng"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UploadLesson;