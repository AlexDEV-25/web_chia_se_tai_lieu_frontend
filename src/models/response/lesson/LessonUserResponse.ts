export interface LessonUserResponse {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    categoryId: number;
    hide: boolean;
    status: 'PUBLISHED' | 'PENDING';
}
