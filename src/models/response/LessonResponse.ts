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
    status: Status;
    hide: boolean;
    categoryId: number;
    categoryName: string;
    userId: number;
    userName: string;
}

export type Status = 'PENDING' | 'PUBLISHED';
