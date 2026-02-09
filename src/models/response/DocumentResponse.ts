export interface DocumentResponse {
    id: number;
    title: string;
    fileUrl: string;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    downloadsCount: number;
    createdAt: string;
    updatedAt: string;
    status: 'PENDING' | 'PUBLISHED';
    hide: boolean;
    categoryId: number;
    categoryName: string;
    userId: number;
    userName: string;
}

