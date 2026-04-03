import type { APIResponse } from '../models/response/APIResponse';
import { httpGet, httpPost, httpDelete } from "./HttpClient";
import type { NotificationRequest } from '../models/request/NotificationRequest';
import type { NotificationResponse } from '../models/response/notification/NotificationResponse';

export const getAllNotifications = async () => {
    return await httpGet<APIResponse<NotificationResponse>>(`/notifications`);
};

export const createNotification = async (data: NotificationRequest) => {
    return await httpPost<APIResponse<NotificationResponse>>(`/notifications`, data);
};

export const deleteNotification = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/notifications/${id}`);
};
