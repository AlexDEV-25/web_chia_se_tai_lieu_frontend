export interface LessonAdminResponse {
    id: number;
    title: string;
    description: string;
    categoryName: string;
    hide: boolean;
    status: 'PUBLISHED' | 'PENDING';
}
