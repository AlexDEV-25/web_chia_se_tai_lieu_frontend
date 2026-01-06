export interface LessonRequest {
    title: string;
    description: string;
    status?: string;
    hide: boolean;
    categoryId?: number;
}
