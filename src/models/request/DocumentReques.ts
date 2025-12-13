export interface DocumentRequest {
    title: string;
    description: string;
    viewsCount?: number;
    downloadsCount?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    hide: boolean;
    categoryId?: number;

}
