import type { FormEvent } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getCommentsByDocument,
    createDocumentComment,
    getCommentsByLesson,
    createLessonComment,
} from "../../../apis/CommentApi";
import type { CommentRequest } from "../../../models/request/CommentRequest";
import type { CommentTreeResponse } from "../../../models/response/CommentTreeResponse";
import { UserContext } from "../../../AppContext";
import axios from "axios";

interface CommentCompProps {
    docId?: number;
    lessonId?: number;
}

const CommentComp: React.FC<CommentCompProps> = ({ docId, lessonId }) => {
    const userCtx = useContext(UserContext);
    const currentUser = userCtx?.currentUser ?? null;

    const [comments, setComments] = useState<CommentTreeResponse[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [replyContent, setReplyContent] = useState<Record<number, string>>({});
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
    const [submittingTarget, setSubmittingTarget] =
        useState<"root" | number | null>(null);

    const isAuthenticated = Boolean(currentUser);
    const isLessonMode = Boolean(lessonId);
    const targetId = lessonId ?? docId;

    /* ================= COMMENTS ================= */

    const fetchComments = useCallback(async () => {
        if (!targetId) return;

        setLoadingComments(true);
        setCommentError(null);

        try {
            const response = isLessonMode
                ? await getCommentsByLesson(targetId)
                : await getCommentsByDocument(targetId);

            const commentList = Array.isArray(response.result) ? response.result : [];
            setComments(commentList);
        } catch (err: any) {
            let message = "Không thể tải bình luận.";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message ?? err.message ?? message;
            }
            setCommentError(message);
        } finally {
            setLoadingComments(false);
        }
    }, [isLessonMode, targetId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    /* ================= SUBMIT ================= */

    const submitComment = async (content: string, idParent: number) => {
        if (!currentUser || !targetId) return;

        const payload: CommentRequest = {
            content: content.trim(),
            idParent,
            hide: false,
            contentId: targetId,
            userId: currentUser.id,
            type: isLessonMode ? "LESSON" : "DOCUMENT",
        };

        if (isLessonMode) {
            await createLessonComment(payload);
        } else {
            await createDocumentComment(payload);
        }

        await fetchComments();
    };

    const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setCommentError("Vui lòng đăng nhập để bình luận.");
            return;
        }

        if (!commentContent.trim()) {
            setCommentError("Nội dung bình luận không được để trống.");
            return;
        }

        setSubmittingTarget("root");
        setCommentError(null);

        try {
            await submitComment(commentContent, 0);
            setCommentContent("");
        } catch (err: any) {
            let message = "Không thể gửi bình luận.";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message ?? err.message ?? message;
            }
            setCommentError(message);
        } finally {
            setSubmittingTarget(null);
        }
    };

    const handleReplySubmit = async (
        e: FormEvent<HTMLFormElement>,
        parentId: number
    ) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setCommentError("Vui lòng đăng nhập để bình luận.");
            return;
        }

        const content = replyContent[parentId]?.trim();
        if (!content) {
            setCommentError("Nội dung trả lời không được để trống.");
            return;
        }

        setSubmittingTarget(parentId);
        setCommentError(null);

        try {
            await submitComment(content, parentId);
            setReplyContent((p) => ({ ...p, [parentId]: "" }));
            setActiveReplyId(null);
        } catch (err: any) {
            let message = "Không thể gửi trả lời.";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message ?? err.message ?? message;
            }
            setCommentError(message);
        } finally {
            setSubmittingTarget(null);
        }
    };

    /* ================= RENDER ================= */

    const renderCommentThread = (comment: CommentTreeResponse) => {
        const isReplying = activeReplyId === comment.id;

        return (
            <div key={comment.id} className="mb-3">
                <div className="d-flex">
                    <img
                        src={`http://localhost:8080/api/images/avatar/${comment.userAvatar ?? "myAvatar.jpg"}`}
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
                                onClick={() =>
                                    setActiveReplyId(
                                        isReplying ? null : comment.id
                                    )
                                }
                            >
                                {isReplying ? "Hủy trả lời" : "Trả lời"}
                            </button>
                        )}

                        {isReplying && (
                            <form
                                className="mt-2"
                                onSubmit={(e) =>
                                    handleReplySubmit(e, comment.id)
                                }
                            >
                                <textarea
                                    className="form-control mb-2"
                                    rows={2}
                                    value={replyContent[comment.id] ?? ""}
                                    onChange={(e) =>
                                        setReplyContent((p) => ({
                                            ...p,
                                            [comment.id]: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    className="btn btn-sm btn-primary"
                                    disabled={submittingTarget === comment.id}
                                >
                                    {submittingTarget === comment.id
                                        ? "Đang gửi..."
                                        : "Gửi trả lời"}
                                </button>
                            </form>
                        )}

                        {comment.children && comment.children.length > 0 && (
                            <div className="mt-3 ms-4 border-start ps-3">
                                {comment.children.map((child) => renderCommentThread(child))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    /* ================= JSX ================= */

    return (
        <div className="border rounded p-4 bg-white">
            <h4 className="mb-3">Bình luận</h4>

            {commentError && (
                <div className="alert alert-danger">{commentError}</div>
            )}

            {loadingComments ? (
                <p>Đang tải bình luận...</p>
            ) : (
                <>
                    {isAuthenticated ? (
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <textarea
                                className="form-control mb-2"
                                rows={3}
                                value={commentContent}
                                onChange={(e) =>
                                    setCommentContent(e.target.value)
                                }
                            />
                            <button
                                className="btn btn-primary"
                                disabled={submittingTarget === "root"}
                            >
                                Gửi bình luận
                            </button>
                        </form>
                    ) : (
                        <div className="alert alert-info">
                            Vui lòng <Link to="/login">đăng nhập</Link> để bình
                            luận
                        </div>
                    )}

                    {comments.length === 0 ? (
                        <p className="text-muted">
                            Chưa có bình luận nào.
                        </p>
                    ) : (
                        comments.map(renderCommentThread)
                    )}
                </>
            )}
        </div>
    );
};

export default CommentComp;
