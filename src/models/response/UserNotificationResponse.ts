export interface UserNotificationResponse {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    notificationId: number;
    notificationContent: string;
    notificationLink: string;
    notificationType: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
    read: boolean;
    createdAt: string;
}
