import type { APIResponse } from './../models/response/APIResponse';
import { httpGet } from "./HttpClient";
import type { DailyCountResponse } from "./../models/response/DailyCountResponse";
import type { CategoryCountResponse } from "./../models/response/CategoryCountResponse";

export const userLast7Days = async () => {
    return await httpGet<APIResponse<DailyCountResponse>>(`admin/statistics/users/last-7-days`);
}

export const documentLast7Days = async () => {
    return await httpGet<APIResponse<DailyCountResponse>>(`admin/statistics/documents/last-7-days`);
}

export const documentByCategory = async () => {
    return await httpGet<APIResponse<CategoryCountResponse>>(`admin/statistics/documents/by-category`);
}

export const lessonLast7Days = async () => {
    return await httpGet<APIResponse<DailyCountResponse>>(`admin/statistics/lessons/last-7-days`);
}

export const lessonByCategory = async () => {
    return await httpGet<APIResponse<CategoryCountResponse>>(`admin/statistics/lessons/by-category`);
}


