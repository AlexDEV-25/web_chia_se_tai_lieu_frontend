import { useState, useEffect } from "react";
import type { LessonRequest } from "./../../../models/request/LessonRequest";
import { getAllPublicCategory } from "./../../../apis/CategoryApi";
import { uploadLesson } from "./../../../apis/LessonApi";
import type { CategoryResponse } from "./../../../models/response/category/CategoryResponse";
import { useRef } from "react";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants/messages";
import { Link } from "react-router-dom";

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

    const [uploadMessage, setUploadMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllPublicCategory();
                setCategories((response?.resultList ?? []).filter(cat => !cat.hide));
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.CATEGORY_LOAD_FAILED);
                console.log(message);;
            }
        };
        fetchCategories();
    }, []);

    const handleUpload = async () => {
        if (isLoading) return;
        setIsLoading(true);

        let tErr = "";
        let vErr = "";

        if (title.trim() === "") tErr = ERROR_MESSAGES.TITLE_EMPTY;
        if (!videoFile) vErr = ERROR_MESSAGES.VIDEO_EMPTY;

        // Set errors
        setErrTitle(tErr);
        setErrVideo(vErr);

        // Stop
        if (tErr || vErr) {
            setIsLoading(false);
            return;
        }

        const lesson: LessonRequest = {
            title,
            description,
            status: "PENDING",
            hide: false,
            categoryId: categoryId === -1 ? null : categoryId
        };

        try {
            const response = await uploadLesson(videoFile!, lesson, documentFile || undefined, subFile || undefined);

            console.log(response);
            setUploadMessage(SUCCESS_MESSAGES.UPLOAD_SUCCESS);

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

        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.UPLOAD_FAILED);
            setUploadMessage(message);
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
                    <Link to="/lesson" className="pill-link">Xem bài giảng</Link>
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
                            <label>Tài liệu đi kèm (pdf) - Tùy chọn</label>
                            <div className="file-drop">
                                <input
                                    type="file"
                                    accept=".pdf"
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
                            {isLoading ? "Đang xử lý..." : "Upload Bài Giảng"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UploadLesson;