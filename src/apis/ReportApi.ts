import type { APIResponse } from './../models/response/APIResponse';
import type { ReportRequest } from '../models/request/ReportRequest';
import { httpGet, httpPost } from "./HttpClient";
import type { ReportResponse } from '../models/response/ReportResponse';


export const documentReport = async (data: ReportRequest) => {
    return await httpPost<APIResponse<ReportResponse>>(`/reports/document`, data);
}

export const lessonReport = async (data: ReportRequest) => {
    return await httpPost<APIResponse<ReportResponse>>(`/reports/lesson`, data);
}

export const getLessonReport = async (lessonId: number) => {
    return await httpGet<APIResponse<ReportResponse>>(`/reports/lesson/${lessonId}`);
}

export const getDocumentReport = async (documentId: number) => {
    return await httpGet<APIResponse<ReportResponse>>(`/reports/document/${documentId}`);
}

