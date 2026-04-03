export interface ReportAdminResponse {
    id: number;
    title: string;
    total: number;
    type: 'DOCUMENT' | 'LESSON';
}
