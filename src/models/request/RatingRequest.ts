export interface RatingRequest {
    rating: number;
    contentId: number;
    type: 'DOCUMENT' | 'LESSON';
}
