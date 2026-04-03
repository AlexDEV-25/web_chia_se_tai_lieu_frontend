export interface RatingAdminResponse {
    id: number;
    title: string;
    average: number;
    total: number;
    type: 'DOCUMENT' | 'LESSON';
}
