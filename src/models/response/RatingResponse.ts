export interface RatingResponse {
    id: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    contentId: number;
    type: 'DOCUMENT' | 'LESSON';
}
