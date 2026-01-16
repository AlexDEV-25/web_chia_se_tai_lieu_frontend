import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FavoriteResponse } from "../../../models/response/FavoriteResponse";
import {
    getDocumentFavoritesByUser,
    getLessonFavoritesByUser,
    removeFavorite,
} from "../../../apis/FavoriteApi";
import FavoritesComp from "./components/FavoritesComp";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import { UserContext } from "../../../AppContext";

type TabKey = "document" | "lesson";

const Favorites: React.FC = () => {
    const userCtx = useContext(UserContext);
    const currentUser = userCtx?.currentUser ?? null;
    const isLoadingUser = userCtx?.isLoadingUser ?? false;
    const isAuthenticated = Boolean(currentUser);

    const [documentFavorites, setDocumentFavorites] = useState<FavoriteResponse[]>([]);
    const [lessonFavorites, setLessonFavorites] = useState<FavoriteResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("document");

    const formatSavedDate = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Không xác định";
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    useEffect(() => {
        if (isLoadingUser) return;

        if (!isAuthenticated) {
            setLoading(false);
            setDocumentFavorites([]);
            setLessonFavorites([]);
            return;
        }

        let isMounted = true;

        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);
            try {
                const [docsRes, lessonsRes] = await Promise.all([
                    getDocumentFavoritesByUser(),
                    getLessonFavoritesByUser(),
                ]);

                if (!isMounted) return;

                setDocumentFavorites(docsRes.resultList ?? []);
                setLessonFavorites(lessonsRes.resultList ?? []);
            } catch (err: any) {
                if (!isMounted) return;
                setError(handleApiError(err, ERROR_MESSAGES.FAVORITES_LOAD_FAILED));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchFavorites();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, isLoadingUser]);

    const handleRemove = async (favoriteId: number) => {
        setRemovingId(favoriteId);
        try {
            await removeFavorite(favoriteId);

            // favoriteId là unique → lọc cả 2 mảng đều an toàn
            setDocumentFavorites((prev) =>
                prev.filter((fav) => fav.id !== favoriteId)
            );
            setLessonFavorites((prev) =>
                prev.filter((fav) => fav.id !== favoriteId)
            );
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.FAVORITE_REMOVE_FAILED);
            alert(message);
        } finally {
            setRemovingId(null);
        }
    };

    const renderEmptyState = (tab: TabKey) => (
        <div className="text-center py-5">
            <p className="mb-3">
                Bạn chưa lưu {tab === "document" ? "tài liệu" : "bài giảng"} nào.
                Khám phá và lưu về để xem sau!
            </p>
            <Link
                to={tab === "document" ? "/" : "/lesson"}
                className="btn btn-primary"
            >
                Khám phá {tab === "document" ? "tài liệu" : "bài giảng"}
            </Link>
        </div>
    );

    if (isLoadingUser) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang kiểm tra phiên đăng nhập...</span>
                </div>
                <p className="mt-3 text-muted">Đang kiểm tra phiên đăng nhập...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    <p className="mb-3">
                        Bạn cần đăng nhập để xem kho tài liệu đã lưu.
                    </p>
                    <Link className="btn btn-primary" to="/login">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 favorite-documents-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <p className="text-muted mb-1">Kho lưu cá nhân</p>
                    <h2 className="fw-bold">Tài liệu yêu thích</h2>
                </div>
                <Link to="/" className="btn btn-outline-secondary">
                    <i className="fa fa-arrow-left me-2" /> Về trang chủ
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="row g-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="col-md-4">
                            <div className="card placeholder-glow" style={{ minHeight: 200 }}>
                                <div className="card-body">
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-5"></span>
                                    <span className="placeholder col-6"></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div
                        className="btn-group mb-4"
                        role="group"
                        aria-label="Tabs kho lưu"
                    >
                        <button
                            type="button"
                            className={`btn ${activeTab === "document"
                                ? "btn-primary"
                                : "btn-outline-secondary"
                                }`}
                            onClick={() => setActiveTab("document")}
                        >
                            Tài liệu ({documentFavorites.length})
                        </button>
                        <button
                            type="button"
                            className={`btn ${activeTab === "lesson"
                                ? "btn-primary"
                                : "btn-outline-secondary"
                                }`}
                            onClick={() => setActiveTab("lesson")}
                        >
                            Bài giảng ({lessonFavorites.length})
                        </button>
                    </div>

                    {activeTab === "document" ? (
                        documentFavorites.length > 0 ? (
                            <FavoritesComp
                                type="DOCUMENT"
                                favorites={documentFavorites}
                                formatSavedDate={formatSavedDate}
                                removingId={removingId}
                                onRemove={handleRemove}
                            />
                        ) : (
                            renderEmptyState("document")
                        )
                    ) : lessonFavorites.length > 0 ? (
                        <FavoritesComp
                            type="LESSON"
                            favorites={lessonFavorites}
                            formatSavedDate={formatSavedDate}
                            removingId={removingId}
                            onRemove={handleRemove}
                        />
                    ) : (
                        renderEmptyState("lesson")
                    )}
                </>
            )}
        </div>
    );
};

export default Favorites;
