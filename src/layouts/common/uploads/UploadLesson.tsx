import { useState } from "react";
import type { LessonRequest } from "./../../../models/request/LessonRequest";
import { uploadLesson } from "./../../../apis/LessonApi";
import { useRef } from "react";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants/messages";
import { Link } from "react-router-dom";
import CategoryComp from "./components/CategoryComp";
import TitleComp from "./components/TitleComp";
import DescriptionComp from "./components/DescriptionComp";
import FileComp from "./components/FileComp";
import ButtonComp from "./components/ButtonComp";

const UploadLesson: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
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
            await uploadLesson(videoFile!, lesson, documentFile || undefined, subFile || undefined);

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
                        <TitleComp title={title} setTitle={setTitle} errTitle={errTitle} />
                        <DescriptionComp description={description} setDescription={setDescription} />
                        <CategoryComp categoryId={categoryId} setCategoryId={setCategoryId} />
                    </div>

                    <div className="upload-column">
                        <FileComp label="Video bài giảng (mp4) *" fileType=".mp4" setFile={setVideoFile} ref={videoRef} />
                        {errVideo && <span className="error-text">{errVideo}</span>}
                        <FileComp label="Tài liệu đi kèm (pdf) - Tùy chọn" fileType=".pdf" setFile={setDocumentFile} ref={documentRef} />

                    </div>

                    <div className="upload-column">
                        <FileComp label="Tài liệu bổ sung (rar) - Tùy chọn" fileType=".rar" setFile={setSubFile} ref={subFileRef} />

                        {uploadMessage && (
                            <div className={uploadMessage.includes("thành công") ? "success-text" : "error-text"}>
                                {uploadMessage}
                            </div>
                        )}

                        <ButtonComp handleUpload={handleUpload} isLoading={isLoading} buttonText="Upload Bài Giảng" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UploadLesson;