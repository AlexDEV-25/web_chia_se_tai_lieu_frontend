import type { APIResponse } from '../models/response/APIResponse';
import type { ReportRequest } from '../models/request/ReportRequest';
import { httpGet, httpPost } from "./HttpClient";
import type { ReportUserResponse } from '../models/response/report/ReportUserResponse';
import type { ReportAdminResponse } from '../models/response/report/ReportAdminResponse';
import type { ReportDetailAdminResponse } from '../models/response/report/ReportDetailAdminResponse';

export const report = async (data: ReportRequest) => {
    return await httpPost<APIResponse<ReportUserResponse>>(`/reports`, data);
}

// Admin APIs
export const getDocumentReports = async (documentId: number) => {
    return await httpGet<APIResponse<ReportDetailAdminResponse>>(`/reports/admin/document/${documentId}`);
}

export const getLessonReports = async (lessonId: number) => {
    return await httpGet<APIResponse<ReportDetailAdminResponse>>(`/reports/admin/lesson/${lessonId}`);
}

export const getAllDocumentReportSummary = async () => {
    return await httpGet<APIResponse<ReportAdminResponse>>(`/reports/admin/document`);
}

export const getAllLessonReportSummary = async () => {
    return await httpGet<APIResponse<ReportAdminResponse>>(`/reports/admin/lesson`);
}

