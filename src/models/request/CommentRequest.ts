export interface CommentRequest {
    content: string;
    idParent: number;
    hide?: boolean;
    documentId: number;
    userId: number;
}
