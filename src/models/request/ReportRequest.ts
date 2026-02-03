export interface ReportRequest {
    userId: number;
    contentId: number;
    reason: string;
    type: 'DOCUMENT' | 'LESSON';
}
