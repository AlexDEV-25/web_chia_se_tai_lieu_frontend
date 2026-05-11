import type { ContentStatus } from "../../enum/common";

export interface DocumentDetailResponse {
    id: number;
    title: string;
    fileUrl: string;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    downloadsCount: number;
    createdAt: string;
    updatedAt: string;
    status: ContentStatus;
    hide: boolean;
    categoryId: number;
    categoryName: string;
    userId: number;
    userName: string;
}
