import { useState } from "react";
import type { DocumentRequest } from "../../../models/request/DocumentRequest";

import { uploadDocument } from "./../../../apis/DocumentApi";
import { useRef } from "react";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants/messages";
import { Link } from "react-router-dom";
import CategoryComp from "./components/CategoryComp";
import TitleComp from "./components/TitleComp";
import DescriptionComp from "./components/DescriptionComp";
import FileComp from "./components/FileComp";
import ButtonComp from "./components/ButtonComp";
const UploadDocument: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // Error states
    const [errTitle, setErrTitle] = useState("");
    const [errFile, setErrFile] = useState("");

    const [uploadMessage, setUploadMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        if (isLoading) return;
        setIsLoading(true);

        let tErr = "";
        let fErr = "";

        if (title.trim() === "") tErr = ERROR_MESSAGES.TITLE_EMPTY;
        if (!file) fErr = ERROR_MESSAGES.FILE_EMPTY;

        // Set errors
        setErrTitle(tErr);
        setErrFile(fErr);

        // Stop
        if (tErr || fErr) {
            setIsLoading(false);
            return;
        }
        const doc: DocumentRequest = {
            title,
            description,
            status: "PENDING"
            , hide: false,
            categoryId: categoryId === -1 ? null : categoryId
        };

        try {
            await uploadDocument(file!, doc);

            setUploadMessage(SUCCESS_MESSAGES.UPLOAD_SUCCESS);

            // Reset form
            setTitle("");
            setDescription("");
            setFile(null);

            // Reset input file
            if (fileRef.current) { fileRef.current.value = ""; }

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
                <h1>Upload Tài liệu</h1>
                <p>Chia sẻ tài liệu học tập với cộng đồng học viên.</p>
                <div className="page-actions">
                    <Link to="/" className="pill-link">Xem tài liệu</Link>
                </div>
            </section>

            <section className="glass-card">
                <div className="upload-grid">
                    <div className="upload-left">
                        <TitleComp title={title} setTitle={setTitle} errTitle={errTitle} />
                        <DescriptionComp description={description} setDescription={setDescription} />
                        <CategoryComp categoryId={categoryId} setCategoryId={setCategoryId} />
                    </div>

                    <div className="upload-right">
                        <FileComp label="Tài liệu (pdf) *" fileType=".pdf" setFile={setFile} ref={fileRef} />
                        {errFile && <span className="error-text">{errFile}</span>}

                        {uploadMessage && (
                            <div className={uploadMessage.includes("thành công") ? "success-text" : "error-text"}>
                                {uploadMessage}
                            </div>
                        )}
                        <ButtonComp handleUpload={handleUpload} isLoading={isLoading} buttonText="Upload Tài Liệu" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UploadDocument;
