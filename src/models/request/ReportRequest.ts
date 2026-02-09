export interface ReportRequest {
    contentId: number;
    reason: string;
    type: 'DOCUMENT' | 'LESSON';
}
