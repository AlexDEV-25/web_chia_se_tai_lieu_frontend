import type { NotificationType } from "../../enum/common";

export interface UserNotificationResponse {
    id: number;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
    notificationId: number;
    notificationContent: string;
    notificationLink: string;
    notificationType: NotificationType;
    read: boolean;
    createdAt: string;
}
