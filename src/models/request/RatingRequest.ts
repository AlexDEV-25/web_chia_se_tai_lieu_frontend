export interface RatingRequest {
    rating: number;
    contentId: number;
    userId: number;
    type: 'DOCUMENT' | 'LESSON';
}
