export interface CommentLessonResponse {
    id: number;
    content: string;
    createdAt: string;
    idParent: number | null;
    updatedAt: string;
    userId: number;
    username: string;
    userAvatar: string;
    lessonId: number;
    hide: boolean;
}
