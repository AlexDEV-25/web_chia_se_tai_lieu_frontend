export interface ReportResponse {
    id: number;
    userId: number;
    username: string;
    reason: string;
    contentId: number;
    title: string;
    type: 'DOCUMENT' | 'LESSON';
}
