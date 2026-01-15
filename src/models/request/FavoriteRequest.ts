export interface FavoriteRequest {
    userId: number;
    contentId: number;
    type: 'DOCUMENT' | 'LESSON';
}
