import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCommentsByDocument, createComment } from "../../../../apis/CommentApi";
import type { CommentRequest } from "../../../../models/request/CommentRequest";
import type { CommentResponse } from "../../../../models/response/CommentResponse";
import type { UserResponse } from "../../../../models/response/UserResponse";
import api from "../../../../apis/HttpClient";

interface CommentCompProps {
    docId: number;
}

const CommentComp: React.FC<CommentCompProps> = ({ docId }) => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [replyContent, setReplyContent] = useState<Record<number, string>>({});
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
    const [submittingTarget, setSubmittingTarget] = useState<"root" | number | null>(null);
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

    const isAuthenticated = Boolean(currentUser);

    const nonHiddenComments = useMemo(
        () => comments.filter((c) => !c.hide),
        [comments]
    );

    const commentsByParent = useMemo(() => {
        const grouped: Record<number, CommentResponse[]> = {};
        nonHiddenComments.forEach((comment) => {
            const parentKey =
                comment.idParent && comment.idParent > 0 ? comment.idParent : 0;
            if (!grouped[parentKey]) grouped[parentKey] = [];
            grouped[parentKey].push(comment);
        });
        Object.values(grouped).forEach((list) =>
            list.sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
        );
        return grouped;
    }, [nonHiddenComments]);

    const topLevelComments = commentsByParent[0] ?? [];

    const fetchCurrentUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCurrentUser(null);
            return;
        }
        try {
            const response = await api.get("/users/my-info");
            setCurrentUser(response.data.result as UserResponse);
        } catch (err) {
            console.error("fetchCurrentUser error", err);
            setCurrentUser(null);
        }
    }, []);

    const fetchComments = useCallback(async () => {
        if (!docId) return;
        setLoadingComments(true);
        setCommentError(null);
        try {
            const response = await getCommentsByDocument(docId);
            setComments(response.resultList ?? []);
        } catch (err) {
            console.error("fetchComments error", err);
            setCommentError("Không thể tải bình luận. Vui lòng thử lại sau.");
        } finally {
            setLoadingComments(false);
        }
    }, [docId]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const submitComment = async (content: string, idParent: number) => {
        if (!currentUser || !docId) return;

        const payload: CommentRequest = {
            content: content.trim(),
            idParent,
            hide: false,
            documentId: docId,
            userId: currentUser.id,
        };
        await createComment(payload);
        await fetchComments();
    };

    const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser) {
            setCommentError("Bạn cần đăng nhập để bình luận.");
            return;
        }
        if (!commentContent.trim()) {
            setCommentError("Nội dung bình luận không được để trống.");
            return;
        }
        setCommentError(null);
        setSubmittingTarget("root");
        try {
            await submitComment(commentContent, 0);
            setCommentContent("");
        } catch (err) {
            console.error("handleCommentSubmit error", err);
            setCommentError("Không thể gửi bình luận. Vui lòng thử lại.");
        } finally {
            setSubmittingTarget(null);
        }
    };

    const handleToggleReply = (commentId: number) => {
        setCommentError(null);
        setActiveReplyId((prev) => (prev === commentId ? null : commentId));
    };

    const handleReplyChange = (commentId: number, value: string) => {
        setReplyContent((prev) => ({
            ...prev,
            [commentId]: value,
        }));
    };

    const handleReplySubmit = async (
        e: FormEvent<HTMLFormElement>,
        parentId: number
    ) => {
        e.preventDefault();
        if (!currentUser) {
            setCommentError("Bạn cần đăng nhập để bình luận.");
            return;
        }
        const content = (replyContent[parentId] ?? "").trim();
        if (!content) {
            setCommentError("Nội dung trả lời không được để trống.");
            return;
        }

        setCommentError(null);
        setSubmittingTarget(parentId);
        try {
            await submitComment(content, parentId);
            setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
            setActiveReplyId(null);
        } catch (err) {
            console.error("handleReplySubmit error", err);
            setCommentError("Không thể gửi trả lời. Vui lòng thử lại.");
        } finally {
            setSubmittingTarget(null);
        }
    };

    const renderCommentThread = (comment: CommentResponse) => {
        const replies = commentsByParent[comment.id] ?? [];
        const isReplying = activeReplyId === comment.id;

        return (
            <div key={comment.id} className="mb-3">
                <div className="d-flex">
                    <img
                        src={
                            comment.userAvatar
                                ? `http://localhost:8080/api/images/avatar/${comment.userAvatar}`
                                : "https://ui-avatars.com/api/?name=" + encodeURIComponent(comment.username)
                        }
                        alt={comment.username}
                        className="rounded-circle me-3"
                        style={{ width: 44, height: 44, objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                            <strong>{comment.username}</strong>
                            <small className="text-muted">
                                {new Date(comment.createdAt).toLocaleString("vi-VN")}
                            </small>
                        </div>
                        <p className="mb-2">{comment.content}</p>
                        {isAuthenticated && (
                            <button
                                className="btn btn-link btn-sm p-0"
                                onClick={() => handleToggleReply(comment.id)}
                            >
                                {isReplying ? "Hủy trả lời" : "Trả lời"}
                            </button>
                        )}

                        {isReplying && (
                            <form
                                className="mt-2"
                                onSubmit={(e) => handleReplySubmit(e, comment.id)}
                            >
                                <textarea
                                    className="form-control mb-2"
                                    rows={2}
                                    value={replyContent[comment.id] ?? ""}
                                    onChange={(e) =>
                                        handleReplyChange(comment.id, e.target.value)
                                    }
                                    placeholder="Nhập nội dung trả lời..."
                                />
                                <div className="text-end">
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-primary"
                                        disabled={submittingTarget === comment.id}
                                    >
                                        {submittingTarget === comment.id
                                            ? "Đang gửi..."
                                            : "Gửi trả lời"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {replies.length > 0 && (
                            <div className="mt-3 ms-4 border-start ps-3">
                                {replies.map((reply) => renderCommentThread(reply))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="border rounded p-4 shadow-sm bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Bình luận</h4>
                <span className="badge bg-light text-dark">
                    {nonHiddenComments.length} bình luận
                </span>
            </div>

            {commentError && (
                <div className="alert alert-danger py-2">{commentError}</div>
            )}

            {loadingComments ? (
                <div className="text-center text-muted py-4">
                    Đang tải bình luận...
                </div>
            ) : (
                <>
                    {isAuthenticated ? (
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <textarea
                                className="form-control mb-2"
                                rows={3}
                                placeholder="Chia sẻ cảm nghĩ của bạn..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <div className="text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submittingTarget === "root"}
                                >
                                    {submittingTarget === "root" ? "Đang gửi..." : "Gửi bình luận"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="alert alert-info mb-4">
                            <strong>Chỉ đọc:</strong> Vui lòng <Link to="/login">đăng nhập</Link> để
                            tham gia bình luận.
                        </div>
                    )}

                    <div className="mt-3">
                        {topLevelComments.length === 0 ? (
                            <p className="text-muted mb-0">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                        ) : (
                            topLevelComments.map((comment) => renderCommentThread(comment))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CommentComp;

