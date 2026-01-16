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

const INDENT_PER_LEVEL = 24;

const CommentComp: React.FC<CommentCompProps> = ({ docId, lessonId }) => {
    const { currentUser } = useContext(UserContext) ?? {};
    const isAuthenticated = Boolean(currentUser);

    const isLessonMode = Boolean(lessonId);
    const targetId = lessonId ?? docId;

    const [comments, setComments] = useState<CommentTreeResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [commentContent, setCommentContent] = useState("");
    const [replyContent, setReplyContent] = useState<Record<number, string>>({});
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
    const [submittingTarget, setSubmittingTarget] = useState<"root" | number | null>(null);

    /* ================= FETCH ================= */

    const fetchComments = useCallback(async () => {
        if (!targetId) return;

        setLoading(true);
        setError(null);

        try {
            const res = isLessonMode
                ? await getCommentsByLesson(targetId)
                : await getCommentsByDocument(targetId);

            setComments(Array.isArray(res.result) ? res.result : []);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Không thể tải bình luận");
            } else {
                setError("Không thể tải bình luận");
            }
        } finally {
            setLoading(false);
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
        console.log(payload);
        isLessonMode
            ? await createLessonComment(payload)
            : await createDocumentComment(payload);

        await fetchComments();
    };

    /* ================= HANDLERS ================= */

    const handleRootSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setSubmittingTarget("root");
        await submitComment(commentContent, 0);
        setCommentContent("");
        setSubmittingTarget(null);
    };

    const handleReplySubmit = async (
        e: FormEvent,
        parentId: number
    ) => {
        e.preventDefault();

        const content = replyContent[parentId]?.trim();
        if (!content) return;

        setSubmittingTarget(parentId);
        await submitComment(content, parentId);
        setReplyContent((p) => ({ ...p, [parentId]: "" }));
        setActiveReplyId(null);
        setSubmittingTarget(null);
    };

    /* ================= RENDER ITEM ================= */

    const renderComment = (comment: CommentTreeResponse) => {
        const isReplying = activeReplyId === comment.id;

        return (
            <div
                key={comment.id}
                className="mb-3"
                style={{ marginLeft: comment.level * INDENT_PER_LEVEL }}
            >
                <div className="d-flex">
                    <img
                        src={`http://localhost:8080/api/images/avatar/${comment.userAvatar ?? "myAvatar.jpg"}`}
                        alt={comment.username}
                        className="rounded-circle me-3"
                        style={{ width: 40, height: 40 }}
                    />

                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                            <strong>{comment.username}</strong>
                            <small className="text-muted">
                                {new Date(comment.createdAt).toLocaleString("vi-VN")}
                            </small>
                        </div>

                        <p className="mb-1">{comment.content}</p>

                        {isAuthenticated && (
                            <button
                                className="btn btn-link btn-sm p-0"
                                onClick={() =>
                                    setActiveReplyId(isReplying ? null : comment.id)
                                }
                            >
                                {isReplying ? "Hủy" : "Trả lời"}
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
                                    Gửi
                                </button>
                            </form>
                        )}

                        {comment.children?.map(renderComment)}
                    </div>
                </div>
            </div>
        );
    };

    /* ================= JSX ================= */

    return (
        <div className="border rounded p-4 bg-white">
            <h4>Bình luận</h4>

            {error && <div className="alert alert-danger">{error}</div>}

            {isAuthenticated ? (
                <form onSubmit={handleRootSubmit} className="mb-4">
                    <textarea
                        className="form-control mb-2"
                        rows={3}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
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
                    Vui lòng <Link to="/login">đăng nhập</Link> để bình luận
                </div>
            )}

            {loading ? (
                <p>Đang tải bình luận...</p>
            ) : comments.length === 0 ? (
                <p className="text-muted">Chưa có bình luận nào</p>
            ) : (
                comments.map(renderComment)
            )}
        </div>
    );
};

export default CommentComp;