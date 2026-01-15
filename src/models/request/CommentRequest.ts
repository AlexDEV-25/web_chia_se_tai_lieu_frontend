export interface CommentRequest {
    content: string;
    idParent: number;
    hide: boolean;
    contentId: number;
    userId: number;
    type: 'DOCUMENT' | 'LESSON';
}
