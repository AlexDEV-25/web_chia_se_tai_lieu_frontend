export interface ContentRatingSummaryResponse {
    id: number;
    title: string;
    average: number;
    total: number;
    type: 'DOCUMENT' | 'LESSON';
}
