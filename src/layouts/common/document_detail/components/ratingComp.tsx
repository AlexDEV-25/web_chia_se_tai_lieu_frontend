import { useEffect, useMemo, useState } from "react";
import type { RatingResponse } from "../../../../models/response/RatingResponse";
import type { UserResponse } from "../../../../models/response/UserResponse";
import { getRatingsByDocument, createRating } from "../../../../apis/RatingApi";
import api from "../../../../apis/HttpClient";

interface RatingCompProps {
    docId: number;
}

const TOTAL_STARS = 5;

const RatingComp: React.FC<RatingCompProps> = ({ docId }) => {
    const [ratings, setRatings] = useState<RatingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getRatingsByDocument(docId);
                setRatings(response.resultList ?? []);
            } catch (err) {
                console.error("fetchRatings error", err);
                setError("Không thể tải đánh giá. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, [docId]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCurrentUserId(null);
            return;
        }
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/users/my-info");
                const user = response.data.result as UserResponse;
                setCurrentUserId(user.id);
            } catch (err) {
                console.error("fetchCurrentUser error", err);
                setCurrentUserId(null);
            }
        };
        fetchCurrentUser();
    }, []);

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
            alert("Vui lòng đăng nhập để đánh giá tài liệu.");
            return;
        }
        if (userRatingValue) {
            alert("Bạn đã đánh giá tài liệu này.");
            return;
        }
        if (!selectedStar) {
            alert("Vui lòng chọn số sao trước khi xác nhận.");
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                rating: selectedStar,
                documentId: docId,
                userId: currentUserId,
            };
            const response = await createRating(payload);
            const created = response.result;
            if (created) {
                setRatings((prev) => [...prev, created]);
            }
        } catch (err) {
            console.error("createRating error", err);
            alert("Không thể gửi đánh giá. Vui lòng thử lại.");
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
