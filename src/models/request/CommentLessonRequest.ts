export interface CommentLessonRequest {
    content: string;
    idParent: number;
    hide?: boolean;
    lessonId: number;
    userId: number;
}
