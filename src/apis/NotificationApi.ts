import type { APIResponse } from '../models/response/APIResponse';
import { httpPost } from "./HttpClient";
import type { NotificationRequest } from '../models/request/NotificationRequest';
import type { NotificationResponse } from '../models/response/notification/NotificationResponse';


export const createNotification = async (data: NotificationRequest) => {
    return await httpPost<APIResponse<NotificationResponse>>(`/notifications`, data);
};


