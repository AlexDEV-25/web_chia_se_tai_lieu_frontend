export interface LessonRequest {
    title: string;
    description: string;
    viewsCount?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    hide: boolean;
    categoryId?: number;
}
