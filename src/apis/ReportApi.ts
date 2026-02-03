import type { APIResponse } from './../models/response/APIResponse';
import type { ReportRequest } from '../models/request/ReportRequest';
import { httpPost, httpDelete } from "./HttpClient";
import type { ReportResponse } from '../models/response/ReportResponse';



export const documentReport = async (data: ReportRequest) => {
    return await httpPost<APIResponse<ReportResponse>>(`/reports/document`, data);
}

export const lessonReport = async (data: ReportRequest) => {
    return await httpPost<APIResponse<ReportResponse>>(`/reports/lesson`, data);
}

export const unReportDocument = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/reports/document/${id}`);
}

export const unReportLesson = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/reports/lesson/${id}`);
}