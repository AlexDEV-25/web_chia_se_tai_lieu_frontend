export interface FavoriteResponse {
    id: number;
    createdAt: string;
    userId: number;
    contentId: number;
    title: string;
    thumbnailUrl: string;
    authorName: string;
    type: 'DOCUMENT' | 'LESSON';
}
