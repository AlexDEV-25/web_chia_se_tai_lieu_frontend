import { useCallback, useEffect, useState } from "react";
import {
    createRating,
    getRatingSummaryByDocument,
    getRatingSummaryByLesson,
    getMyRatingByDocument,
    getMyRatingByLesson,
} from "../../../apis/RatingApi";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import type { RatingSummaryResponse } from "../../../models/response/rating/RatingSummaryResponse";
import AlertDialog from "./AlertDialog";

interface RatingCompProps {
    docId?: number;
    lessonId?: number;
}

const TOTAL_STARS = 5;

const RatingComp: React.FC<RatingCompProps> = ({ docId, lessonId }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [summary, setSummary] = useState<RatingSummaryResponse | null>(null);
    const [userRatingValue, setUserRatingValue] = useState<number | null>(null);
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '' });

    const handleCloseAlert = () => setAlertDialog({ isOpen: false, title: '', message: '' });

    const isLessonMode = Boolean(lessonId);
    const targetId = lessonId ?? docId;

    const fetchRatingSummary = useCallback(async () => {
        if (!targetId) {
            setSummary(null);
            setLoading(false);
            setError(ERROR_MESSAGES.CONTENT_NOT_FOUND);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            if (isLessonMode) {
                const response = await getRatingSummaryByLesson(targetId)
                setSummary(response.result ?? null);
            } else {
                const response = await getRatingSummaryByDocument(targetId)
                setSummary(response.result ?? null);
            }
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.RATING_LOAD_FAILED));
        } finally {
            setLoading(false);
        }
    }, [isLessonMode, targetId]);

    useEffect(() => {
        fetchRatingSummary();
    }, [fetchRatingSummary]);


    useEffect(() => {
        const fetchMyRating = async () => {
            if (!targetId || !isAuthenticated) {
                setUserRatingValue(null);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                if (isLessonMode) {
                    const response = await getMyRatingByLesson(targetId || 0)
                    setUserRatingValue(response.result ?? null);
                } else {
                    const response = await getMyRatingByDocument(targetId || 0)
                    setUserRatingValue(response.result ?? null);
                }
            } catch (err: any) {
                setError(handleApiError(err, ERROR_MESSAGES.RATING_LOAD_FAILED));
            } finally {
                setLoading(false);
            }
        };
        fetchMyRating();
    }, [isLessonMode, targetId]);

    const totalRatings = summary?.total ?? 0;
    const averageRating = summary?.average ?? 0;

    const activeStarLevel = hoveredStar ?? selectedStar ?? userRatingValue ?? Math.round(averageRating);

    const handleSubmitRating = async () => {
        if (!isAuthenticated) {
            setAlertDialog({
                isOpen: true,
                title: 'Yêu cầu đăng nhập',
                message: ERROR_MESSAGES.LOGIN_REQUIRED_RATING
            });
            return;
        }
        if (userRatingValue || !selectedStar || !targetId) {
            return;
        }
        setSubmitting(true);
        try {
            if (isLessonMode) {
                const response = await createRating({
                    rating: selectedStar,
                    contentId: targetId,
                    type: 'LESSON',
                });
                if (response.result) {
                    setUserRatingValue(response.result.rating);
                    setSelectedStar(null);
                    fetchRatingSummary(); // Refetch summary to update total and average
                }
            } else {
                const response = await createRating({
                    rating: selectedStar,
                    contentId: targetId,
                    type: 'DOCUMENT',
                });
                if (response.result) {
                    setUserRatingValue(response.result.rating);
                    setSelectedStar(null);
                    fetchRatingSummary(); // Refetch summary to update total and average
                }
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.RATING_SUBMIT_FAILED);
            setAlertDialog({
                isOpen: true,
                title: 'Lỗi gửi đánh giá',
                message: message
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="rating-comp border rounded bg-white p-3 shadow-sm mb-4">
                <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                        <p className="text-muted mb-1">Đánh giá tài liệu này</p>
                        <div className="d-flex align-items-baseline gap-2">
                            <span className="display-6 mb-0">{averageRating.toFixed(1)}</span>
                            <span className="text-muted">/ {TOTAL_STARS}</span>
                        </div>
                        <p className="text-muted small mb-0">
                            {totalRatings > 0 ? `${totalRatings} lượt đánh giá` : "Chưa có đánh giá"}
                        </p>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <div>
                            {Array.from({ length: TOTAL_STARS }).map((_, index) => {
                                const starValue = index + 1;
                                const isActive = starValue <= activeStarLevel;
                                return (
                                    <button
                                        key={starValue}
                                        type="button"
                                        className="btn btn-link text-warning p-0 fs-3"
                                        onMouseEnter={() => !userRatingValue && setHoveredStar(starValue)}
                                        onMouseLeave={() => !userRatingValue && setHoveredStar(null)}
                                        onClick={() => !userRatingValue && setSelectedStar(starValue)}
                                        disabled={Boolean(userRatingValue) || submitting}
                                    >
                                        <i className={`fa ${isActive ? "fa-star" : "fa-star-o"}`} />
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={handleSubmitRating}
                            disabled={Boolean(userRatingValue) || submitting || !selectedStar}
                        >
                            {submitting ? "Đang lưu..." : "Xác nhận"}
                        </button>
                    </div>
                </div>

                {loading && <p className="text-muted small mt-2 mb-0">Đang tải đánh giá...</p>}
                {error && <p className="text-danger small mt-2 mb-0">{error}</p>}
                {!loading && userRatingValue && (
                    <p className="text-success small mt-2 mb-0">
                        Bạn đã đánh giá tài liệu này {userRatingValue}/5 sao.
                    </p>
                )}
                {!loading && !userRatingValue && (
                    <p className="text-muted small mt-2 mb-0">
                        Chọn số sao rồi nhấn "Xác nhận" để lưu đánh giá.
                    </p>
                )}
            </div>
            <AlertDialog
                isOpen={alertDialog.isOpen}
                title={alertDialog.title}
                message={alertDialog.message}
                onClose={handleCloseAlert}
            />
        </>
    );
};

export default RatingComp;
