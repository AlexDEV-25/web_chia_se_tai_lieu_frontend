import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getCommentsByDocument,
    createComment,
    getCommentsByLesson,
} from "../../../../apis/CommentApi";
import type { CommentRequest } from "../../../../models/request/CommentRequest";
import type { CommentTreeResponse } from "../../../../models/response/comment/CommentTreeResponse";
import { handleApiError } from "../../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../../constants/messages";
import CommentItemComp from "./CommentItemComp";

interface CommentCompProps {
    docId?: number;
    lessonId?: number;
}

const CommentComp: React.FC<CommentCompProps> = ({ docId, lessonId }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

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

            setComments(res.resultList ?? []);
        } catch (err) {
            setError(handleApiError(err, ERROR_MESSAGES.COMMENT_LOAD_FAILED));
        } finally {
            setLoading(false);
        }
    }, [isLessonMode, targetId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    /* ================= SUBMIT ================= */

    const submitComment = async (content: string, parentId: number | null) => {
        if (!isAuthenticated || !targetId) return;

        const payload: CommentRequest = {
            content: content.trim(),
            parentId,
            hide: false,
            contentId: targetId,
            type: isLessonMode ? "LESSON" : "DOCUMENT",
        };
        await createComment(payload)


        await fetchComments();
    };

    /* ================= HANDLERS ================= */

    const handleRootSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setSubmittingTarget("root");
        await submitComment(commentContent, null);
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
                comments.map((comment) => (
                    <CommentItemComp
                        key={comment.id}
                        comment={comment}
                        level={0}
                        activeReplyId={activeReplyId}
                        setActiveReplyId={setActiveReplyId}
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                        submittingTarget={submittingTarget}
                        handleReplySubmit={handleReplySubmit}
                        isAuthenticated={isAuthenticated}
                    />
                ))
            )}
        </div>
    );
};

export default CommentComp;