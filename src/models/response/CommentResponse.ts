export interface CommentResponse {
    id: number;
    content: string;
    createdAt: string;
    idParent: number | null;
    updatedAt: string;
    userId: number;
    username: string;
    userAvatar: string;
    documentId: number;
    hide: boolean;
}
