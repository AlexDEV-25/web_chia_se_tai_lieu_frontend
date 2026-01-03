export interface CommentDocumentRequest {
    content: string;
    idParent: number;
    hide?: boolean;
    documentId: number;
    userId: number;
}
