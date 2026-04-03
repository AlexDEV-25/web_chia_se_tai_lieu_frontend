export interface NotificationRequest {
    content: string;
    link?: string;
    type: 'SYSTEM' | 'COMMENT' | 'FOLLOW' | 'RATING' | 'REPORT';
}
