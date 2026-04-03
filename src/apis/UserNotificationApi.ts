import type { APIResponse } from '../models/response/APIResponse';
import type { UserNotificationResponse } from '../models/response/usernotification/UserNotificationResponse';
import { httpGet, httpPut } from "./HttpClient";

export const getByReceiver = async () => {
    return await httpGet<APIResponse<UserNotificationResponse>>(`/user-notifications/receiver`);
}

export const getByReceiverIdAndReadFalse = async () => {
    return await httpGet<APIResponse<UserNotificationResponse>>(`/user-notifications/receiver/unread`);
}

export const read = async (id: number) => {
    return await httpPut<APIResponse<UserNotificationResponse>>(`/user-notifications/read/${id}`, {});
}

export const readAll = async (id: number) => {
    return await httpPut<APIResponse<void>>(`/user-notifications/read-all/${id}`, {});
}


