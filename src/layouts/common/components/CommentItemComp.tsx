import type { FormEvent } from "react";
import type { CommentTreeResponse } from "../../../models/response/CommentTreeResponse";

interface CommentItemCompProps {
    comment: CommentTreeResponse;
    level: number;
    activeReplyId: number | null;
    setActiveReplyId: (id: number | null) => void;
    replyContent: Record<number, string>;
    setReplyContent: React.Dispatch<React.SetStateAction<Record<number, string>>>;
    submittingTarget: "root" | number | null;
    handleReplySubmit: (e: FormEvent, parentId: number) => Promise<void>;
    isAuthenticated: boolean;
}

const INDENT_PER_LEVEL = 24;

const CommentItemComp: React.FC<CommentItemCompProps> = ({
    comment,
    level,
    activeReplyId,
    setActiveReplyId,
    replyContent,
    setReplyContent,
    submittingTarget,
    handleReplySubmit,
    isAuthenticated,
}) => {
    const isReplying = activeReplyId === comment.id;

    return (
        <div
            className="mb-3"
            style={{ marginLeft: level * INDENT_PER_LEVEL }}
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

                    {comment.children?.map((child) => (
                        <CommentItemComp
                            key={child.id}
                            comment={child}
                            level={level + 1}
                            activeReplyId={activeReplyId}
                            setActiveReplyId={setActiveReplyId}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            submittingTarget={submittingTarget}
                            handleReplySubmit={handleReplySubmit}
                            isAuthenticated={isAuthenticated}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentItemComp;