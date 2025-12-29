export interface FavoriteLessonResponse {
    id: number;
    createdAt: string;
    userId: number;
    lessonId: number;
    lessonTitle: string;
    lessonThumbnailUrl: string;
    authorName: string;
}
