export interface DocumentResponse {
    id: number;
    title: string;
    fileUrl: string;
    type: DocumentType;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    downloadsCount: number;
    createdAt: string;
    updatedAt: string;
    status: Status;
    hide: boolean;
    categoryId: number;
    categoryName: string;
    userId: number;
}

// Nếu enums ở FE cũng cần:
export type DocumentType = 'PDF' | 'WORD' | 'EXCEL' | 'IMAGE' | 'OTHER';
// Tuỳ bạn định nghĩa bên BE

export type Status = 'PENDING' | 'PUBLISHED';
