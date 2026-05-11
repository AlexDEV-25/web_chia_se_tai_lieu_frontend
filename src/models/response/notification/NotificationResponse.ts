import type { NotificationType } from "../../enum/common";

export interface NotificationResponse {
    id: number;
    content: string;
    link?: string;
    type: NotificationType;
}
