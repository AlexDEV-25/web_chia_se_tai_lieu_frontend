import React, { useState } from "react";
import { documentReport, lessonReport } from "../../../apis/ReportApi";

import { handleApiError } from "../../../utils/errorHandler";
import type { ReportRequest } from "../../../models/request/ReportRequest";

interface ReportCompProps {
    contentId: number;
    contentType: "DOCUMENT" | "LESSON";
}

const ReportComp: React.FC<ReportCompProps> = ({ contentId, contentType }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("SPAM");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const reasons = [
        { value: "SPAM", label: "Spam" },
        { value: "INAPPROPRIATE", label: "Nội dung không phù hợp" },
        { value: "COPYRIGHT", label: "Vi phạm bản quyền" },
        { value: "OFFENSIVE", label: "Nội dung xúc phạm" },
        { value: "BROKEN", label: "Nội dung không hoạt động" },
        { value: "OTHER", label: "Khác" },
    ];

    const handleOpenModal = () => {
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để báo cáo nội dung");
            return;
        }
        setIsModalOpen(true);
        setReportReason("SPAM");
        setCustomReason("");
        setSubmitMessage(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCustomReason("");
        setSubmitMessage(null);
    };

    const handleSubmitReport = async () => {
        if (!isAuthenticated) {
            setSubmitMessage({
                type: "error",
                text: "Vui lòng đăng nhập để báo cáo",
            });
            return;
        }

        if (reportReason === "OTHER" && customReason.trim() === "") {
            setSubmitMessage({
                type: "error",
                text: "Vui lòng nhập nội dung báo cáo khi chọn 'Khác'",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const reasonToSend = reportReason === "OTHER" ? customReason.trim() : reportReason;

            const reportData: ReportRequest = {
                contentId,
                reason: reasonToSend,
                type: contentType,
            };

            if (contentType === "DOCUMENT") {
                await documentReport(reportData);
            } else {
                await lessonReport(reportData);
            }

            setSubmitMessage({
                type: "success",
                text: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét sớm!",
            });

            setTimeout(() => {
                handleCloseModal();
            }, 2000);
        } catch (error: any) {
            const message = handleApiError(error, "Gửi báo cáo thất bại");
            setSubmitMessage({
                type: "error",
                text: message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Nút Report */}
            <button
                onClick={handleOpenModal}
                className="btn btn-outline-danger btn-sm"
                title="Báo cáo nội dung"
            >
                <i className="fa fa-flag-o me-1" /> Báo cáo
            </button>

            {/* Modal Report */}
            {isModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content report-modal">
                            <div className="modal-header">
                                <h5 className="modal-title">Báo cáo nội dung</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="reason" className="form-label">
                                        Lý do báo cáo
                                    </label>
                                    <select
                                        id="reason"
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="form-select"
                                        disabled={isSubmitting}
                                    >
                                        {reasons.map((r) => (
                                            <option key={r.value} value={r.value}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {reportReason === "OTHER" && (
                                    <div className="mb-3">
                                        <label htmlFor="customReason" className="form-label">
                                            Nội dung báo cáo
                                        </label>
                                        <textarea
                                            id="customReason"
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            className="form-control"
                                            rows={3}
                                            placeholder="Mô tả lý do báo cáo..."
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                )}

                                {submitMessage && (
                                    <div className={`alert alert-${submitMessage.type === "success" ? "success" : "danger"} mb-3`}>
                                        {submitMessage.text}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleSubmitReport}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReportComp;
