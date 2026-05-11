import type { NotificationType } from "../enum/common";

export interface NotificationRequest {
    content: string;
    link?: string;
    type: NotificationType;
}
