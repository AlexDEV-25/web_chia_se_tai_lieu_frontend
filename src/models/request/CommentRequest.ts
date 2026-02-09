export interface CommentRequest {
    content: string;
    idParent: number;
    hide: boolean;
    contentId: number;
    type: 'DOCUMENT' | 'LESSON';
}
