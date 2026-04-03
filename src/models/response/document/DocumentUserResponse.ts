export interface DocumentUserResponse {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    downloadsCount: number;
    categoryId: number;
    hide: boolean;
    status: 'PUBLISHED' | 'PENDING';
}
