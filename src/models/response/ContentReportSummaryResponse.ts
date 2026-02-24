export interface ContentReportSummaryResponse {
    id: number;
    title: string;
    total: number;
    type: 'DOCUMENT' | 'LESSON';
}
