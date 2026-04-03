export interface UserNotificationResponse {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    notificationId: number;
    notificationContent: string;
    notificationLink: string;
    notificationType: 'SYSTEM' | 'COMMENT' | 'FOLLOW' | 'RATING' | 'REPORT';
    read: boolean;
    createdAt: string;
}
