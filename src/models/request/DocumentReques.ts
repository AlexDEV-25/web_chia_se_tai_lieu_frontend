export interface DocumentRequest {
    title: string;
    description: string;
    status?: "PUBLISHED" | "PENDING";
    hide: boolean;
    categoryId?: number;
}
