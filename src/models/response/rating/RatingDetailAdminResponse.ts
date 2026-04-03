export interface RatingDetailAdminResponse {
    contentId: number;
    title: string;
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
    type: 'DOCUMENT' | 'LESSON';
}
