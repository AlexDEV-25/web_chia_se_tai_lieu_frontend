export interface FavoriteResponse {
    id: number;
    createdAt: string;
    contentId: number;
    title: string;
    thumbnailUrl: string;
    authorName: string;
    type: 'DOCUMENT' | 'LESSON';
}
