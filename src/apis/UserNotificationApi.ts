import type { APIResponse } from './../models/response/APIResponse';
import type { UserNotificationResponse } from '../models/response/UserNotificationResponse';
import { httpGet, httpPut } from "./HttpClient";

export const getByReceiver = async () => {
    return await httpGet<APIResponse<UserNotificationResponse>>(`/user-notifications/receiver`);
}

export const getByReceiverIdAndReadFalse = async () => {
    return await httpGet<APIResponse<void>>(`/user-notifications/receiver/unread`);
}


export const read = async (id: number) => {
    return await httpPut<APIResponse<UserNotificationResponse>>(`/user-notifications/read/${id}`);
}


