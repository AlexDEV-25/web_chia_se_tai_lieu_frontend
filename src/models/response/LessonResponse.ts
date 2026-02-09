export interface LessonResponse {
    id: number;
    title: string;
    lessonUrl: string;
    documentUrl: string;
    subFileUrl: string;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    createdAt: string;
    updatedAt: string;
    status: 'PENDING' | 'PUBLISHED';
    hide: boolean;
    categoryId: number;
    categoryName: string;
    userId: number;
    userName: string;
}


