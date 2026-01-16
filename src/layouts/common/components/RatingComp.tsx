import { useEffect, useMemo, useState, useContext } from "react";
import type { RatingResponse } from "../../../models/response/RatingResponse";
import {
    getRatingsByDocument,
    createRatingDocument,
    getRatingsByLesson,
    createRatingLesson,
} from "../../../apis/RatingApi";
import { UserContext } from "../../../AppContext";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";

interface RatingCompProps {
    docId?: number;
    lessonId?: number;
}

const TOTAL_STARS = 5;

const RatingComp: React.FC<RatingCompProps> = ({ docId, lessonId }) => {
    const userCtx = useContext(UserContext);
    const currentUser = userCtx?.currentUser;
    const currentUserId = currentUser?.id ?? null;

    const [ratings, setRatings] = useState<RatingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isLessonMode = Boolean(lessonId);
    const targetId = lessonId ?? docId;

    useEffect(() => {
        const fetchRatings = async () => {
            if (!targetId) {
                setRatings([]);
                setLoading(false);
                setError(ERROR_MESSAGES.CONTENT_NOT_FOUND);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = isLessonMode
                    ? await getRatingsByLesson(targetId)
                    : await getRatingsByDocument(targetId);
                setRatings(response.resultList ?? []);
            } catch (err: any) {
                setError(handleApiError(err, ERROR_MESSAGES.RATING_LOAD_FAILED));
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, [isLessonMode, targetId]);

    const totalRatings = ratings.length;
    const averageRating = useMemo(() => {
        if (!ratings.length) return 0;
        const total = ratings.reduce((sum, item) => sum + (item.rating ?? 0), 0);
        return total / ratings.length;
    }, [ratings]);

    const userRatingValue = useMemo(() => {
        if (!currentUserId) return null;
        return ratings.find((r) => r.userId === currentUserId)?.rating ?? null;
    }, [ratings, currentUserId]);

    const activeStarLevel = hoveredStar ?? selectedStar ?? userRatingValue ?? Math.round(averageRating);

    const handleSubmitRating = async () => {
        if (!currentUserId) {
            alert(ERROR_MESSAGES.LOGIN_REQUIRED_RATING);
            return;
        }
        if (userRatingValue) {
            alert(ERROR_MESSAGES.RATING_ALREADY_EXISTS);
            return;
        }
        if (!selectedStar) {
            alert(ERROR_MESSAGES.RATING_SELECT_REQUIRED);
            return;
        }
        if (!targetId) {
            alert(ERROR_MESSAGES.CONTENT_NOT_FOUND);
            return;
        }
        setSubmitting(true);
        try {
            if (isLessonMode) {
                const response = await createRatingLesson({
                    rating: selectedStar,
                    contentId: targetId,
                    userId: currentUserId,
                    type: 'LESSON',
                });
                const created = response.result;
                if (created) {
                    setRatings((prev) => [...prev, created]);
                }
            } else {
                const response = await createRatingDocument({
                    rating: selectedStar,
                    contentId: targetId,
                    userId: currentUserId,
                    type: 'DOCUMENT',
                });
                const created = response.result;
                if (created) {
                    setRatings((prev) => [...prev, created]);
                }
            }
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.RATING_SUBMIT_FAILED);
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
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
    );
};

export default RatingComp;
