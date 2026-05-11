import type { ContentStatus } from "../../enum/common";

export interface LessonDetailResponse {
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
    status: ContentStatus;
    hide: boolean;
    categoryId: number;
    categoryName: string;
    userId: number;
    userName: string;
}
