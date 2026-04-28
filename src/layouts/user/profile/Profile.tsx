import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ERROR_MESSAGES } from "../../../constants/messages";
import { handleApiError } from "../../../utils/errorHandler";
import { getUserInfo } from "../../../apis/UserApi";
import type { DocumentFavoriteResponse } from "../../../models/response/document/DocumentFavoriteResponse";
import { countLessonOfUser, getListLessonByUser } from "../../../apis/LessonApi";

import type { UserBioResponse } from "../../../models/response/user/UserBioResponse";
import type { FollowCountResponse } from "../../../models/response/userfollow/FollowCountResponse";
import { checkFollowed, checkIsMe, followUser, getFollowCount, unfollowUser } from "../../../apis/UserFollowApi";
import { addFavorite, removeDocumentFavorite, removeLessonFavorite } from "../../../apis/FavoriteApi";
import type { FavoriteRequest } from "../../../models/request/FavoriteRequest";
import GrindItem from "../../common/components/GrindItem";

import { countDocumentOfUser, getListDocumentByUser } from "../../../apis/DocumentApi";

import type { LessonFavoriteResponse } from "../../../models/response/lesson/LessonFavoriteResponse";
import AlertDialog from "../../common/components/AlertDialog";

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);

    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const [followerCount, setFollowerCount] = useState<FollowCountResponse | null>(null);
    const [user, setUser] = useState<UserBioResponse | null>(null);
    const [infoMessage, setInfoMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"documents" | "lessons">("documents");
    const [documents, setDocuments] = useState<DocumentFavoriteResponse[]>([]);
    const [lessons, setLessons] = useState<LessonFavoriteResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isMe, setIsMe] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [documentQuantity, setDocumentQuantity] = useState<number>(0);
    const [lessonQuantity, setLessonQuantity] = useState<number>(0);
    const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '' });
    const handleCloseAlert = () => setAlertDialog({ isOpen: false, title: '', message: '' });
    const fetchFollowerCount = useCallback(async () => {
        try {
            const response = await getFollowCount(userId);
            setFollowerCount(response.result);
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    }, [userId]);

    const handleToggleFavoriteDocument = async (doc: DocumentFavoriteResponse) => {
        if (!isAuthenticated) {
            setAlertDialog({
                isOpen: true,
                title: 'Yêu cầu đăng nhập',
                message: ERROR_MESSAGES.LOGIN_REQUIRED_FAVORITE
            });
            return;
        }

        setFavoriteLoadingId(doc.id);

        try {
            if (doc.favorite === true) {
                await removeDocumentFavorite(doc.id);
                setDocuments((prev) =>
                    prev.map((item) =>
                        item.id === doc.id ? { ...item, favorite: false } : item
                    )
                );
            } else {
                const data: FavoriteRequest = {
                    contentId: doc.id,
                    type: "DOCUMENT",
                };
                await addFavorite(data);
                setDocuments((prev) =>
                    prev.map((item) =>
                        item.id === doc.id ? { ...item, favorite: true } : item
                    )
                );
            }
        } catch (err: any) {
            setAlertDialog({
                isOpen: true,
                title: 'Lỗi',
                message: handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED)
            });
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const handleToggleFavoriteLesson = async (lesson: LessonFavoriteResponse) => {
        if (!isAuthenticated) {
            setAlertDialog({
                isOpen: true,
                title: 'Yêu cầu đăng nhập',
                message: ERROR_MESSAGES.LOGIN_REQUIRED_LESSON_FAVORITE
            });
            return;
        }

        setFavoriteLoadingId(lesson.id);

        try {
            if (lesson.favorite === true) {
                await removeLessonFavorite(lesson.id);
                setLessons((prev) =>
                    prev.map((item) =>
                        item.id === lesson.id ? { ...item, favorite: false } : item
                    )
                );
            } else {
                const data: FavoriteRequest = {
                    contentId: lesson.id,
                    type: "LESSON",
                };
                await addFavorite(data);
                setLessons((prev) =>
                    prev.map((item) =>
                        item.id === lesson.id ? { ...item, favorite: true } : item
                    )
                );
            }
        } catch (err: any) {
            setAlertDialog({
                isOpen: true,
                title: 'Lỗi',
                message: handleApiError(err, ERROR_MESSAGES.FAVORITE_UPDATE_FAILED)
            });
        } finally {
            setFavoriteLoadingId(null);
        }
    };

    const fetchCheckFollowed = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const response = await checkFollowed(userId);
            setIsFollowing(response.result ?? false);
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    }, [userId]);

    const fetchCheckIsMe = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const response = await checkIsMe(userId);
            setIsMe(response.result ?? false);
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    }, [userId]);

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await getUserInfo(userId);
            setUser(response.result);
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    }, [userId]);

    const fetchCountDocument = useCallback(async () => {
        try {
            const response = await countDocumentOfUser(userId);
            setDocumentQuantity(response?.result || 0);
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.COUNT_DOCUMENT_ERROR))
        }
    }, [userId]);
    const fetchCountLesson = useCallback(async () => {
        try {
            const response = await countLessonOfUser(userId);
            setLessonQuantity(response?.result || 0);
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.COUNT_LESSON_ERROR))
        }
    }, [userId]);

    const handleFollow = async () => {
        if (!isAuthenticated) {
            setAlertDialog({
                isOpen: true,
                title: 'Yêu cầu đăng nhập',
                message: ERROR_MESSAGES.LOGIN_REQUIRED_FOLLOW
            });
            return;
        }
        try {
            setFollowLoading(true);
            await followUser(userId);
            setIsFollowing(true);
            await fetchFollowerCount();
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        } finally {
            setFollowLoading(false);
        }
    };

    const handleUnFollow = async () => {
        if (!isAuthenticated) return;
        if (!window.confirm("Bạn có chắc muốn hủy theo dõi người dùng này?")) return;
        try {
            setFollowLoading(true);
            await unfollowUser(userId);
            setIsFollowing(false);
            await fetchFollowerCount();
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        } finally {
            setFollowLoading(false);
        }
    };

    useEffect(() => {
        const initProfile = async () => {
            setLoading(true);
            await Promise.all([
                fetchUserInfo(),
                fetchFollowerCount(),
                fetchCheckFollowed(),
                fetchCheckIsMe(),
                fetchCountDocument(),
                fetchCountLesson(),
            ]);
            setLoading(false);
        };
        initProfile();
    }, [userId]);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (activeTab === "documents") {
                const response = await getListDocumentByUser(userId);
                setDocuments(response.resultList || []);
            } else {
                const response = await getListLessonByUser(userId);
                setLessons(response.resultList || []);
            }
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.UPLOAD_HISTORY_LOAD_FAILED));
        } finally {
            setLoading(false);
        }
    }, [activeTab, userId]);

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-cover"></div>

                <div className="profile-info-section">
                    <div className="profile-avatar">
                        <img
                            src={`${user?.avatarUrl ?? "myAvatar.jpg"}`}
                            alt={user?.username || "User"}
                            className="avatar-img"
                        />
                    </div>

                    <div className="profile-details">
                        <div className="profile-name-follow">
                            <div className="profile-name-bio">
                                <h1 className="user-name">{user?.username || "User Name"}</h1>
                                <p className="user-bio">{user?.bio || "No bio available"}</p>
                            </div>
                            {isMe && (
                                <div className="profile-edit-btn">
                                    <button className="edit-profile-btn"> <Link to="/myprofile">Chỉnh sửa hồ sơ</Link></button>
                                </div>
                            )}
                            {!isMe && (
                                <button
                                    className={`follow-btn ${isFollowing ? "following" : ""}`}
                                    onClick={isFollowing ? handleUnFollow : handleFollow}
                                    disabled={followLoading}
                                >
                                    {followLoading ? "Loading..." : (isFollowing ? "Hủy theo dõi" : "Theo dõi")}
                                </button>)}
                        </div>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{documentQuantity + lessonQuantity}</span>
                                <span className="stat-label">Bài viết</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{followerCount?.follower || 0}</span>
                                <span className="stat-label">Người theo dõi</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{followerCount?.following || 0}</span>
                                <span className="stat-label">Đang theo dõi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {infoMessage && (
                <div className="alert alert-danger">
                    {infoMessage}
                </div>
            )}

            {error && (
                <div className="alert alert-warning">
                    {error}
                </div>
            )}

            {/* Tabs and Content */}
            <div className="profile-content">
                <div className="tabs-section">
                    <div className="tabs-nav">
                        <button
                            className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
                            onClick={() => setActiveTab("documents")}
                        >
                            📄 Tài liệu ({documentQuantity})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "lessons" ? "active" : ""}`}
                            onClick={() => setActiveTab("lessons")}
                        >
                            📚 Bài học ({lessonQuantity})
                        </button>
                    </div>

                    <div className="tab-content">
                        {loading ? (
                            <div className="loading-state">
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : activeTab === "documents" ? (
                            <div className="profile-items-grid">
                                {documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <GrindItem
                                            key={doc.id}
                                            itemType="document"
                                            link={`/document/${doc.id}`}
                                            title={doc.title}
                                            thumbnailUrl={
                                                doc.thumbnailUrl
                                                    ? `${doc.thumbnailUrl}`
                                                    : undefined
                                            }
                                            subtitle={
                                                <p>
                                                    {doc.description
                                                        ? `${doc.description.substring(0, 20)}...`
                                                        : "Tài liệu chưa có mô tả."}
                                                </p>
                                            }
                                            viewsCount={doc.viewsCount}
                                            downloadsCount={doc.downloadsCount}
                                            showInlineFavorite
                                            isFavorite={doc.favorite}
                                            favoriteDisabled={favoriteLoadingId === doc.id}
                                            onToggleFavorite={() => handleToggleFavoriteDocument(doc)}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>Người dùng chưa có tài liệu nào</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="profile-items-grid">
                                {lessons.length > 0 ? (
                                    lessons.map((lesson) => (
                                        <GrindItem
                                            key={lesson.id}
                                            itemType="lesson"
                                            link={`/lesson/${lesson.id}`}
                                            title={lesson.title}
                                            thumbnailUrl={
                                                lesson.thumbnailUrl
                                                    ? `${lesson.thumbnailUrl}`
                                                    : undefined
                                            }
                                            subtitle={
                                                <p>
                                                    {lesson.description
                                                        ? `${lesson.description.substring(0, 20)}...`
                                                        : "Bài học chưa có mô tả."}
                                                </p>
                                            }
                                            viewsCount={lesson.viewsCount}
                                            showVideoOverlay
                                            showInlineFavorite
                                            isFavorite={lesson.favorite}
                                            favoriteDisabled={favoriteLoadingId === lesson.id}
                                            onToggleFavorite={() => handleToggleFavoriteLesson(lesson)}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>Người dùng chưa có bài học nào</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AlertDialog
                isOpen={alertDialog.isOpen}
                title={alertDialog.title}
                message={alertDialog.message}
                onClose={handleCloseAlert}
            />
        </div>
    );
}

export default Profile;