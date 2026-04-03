export interface NotificationResponse {
    id: number;
    content: string;
    link?: string;
    type: 'SYSTEM' | 'COMMENT' | 'FOLLOW' | 'RATING' | 'REPORT';
}
