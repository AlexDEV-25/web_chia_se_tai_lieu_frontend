export interface FavoriteDocumentResponse {
    id: number;
    createdAt: string;
    userId: number;
    documentId: number;
    documentTitle: string;
    documentThumbnailUrl: string;
    authorName: string;
}
