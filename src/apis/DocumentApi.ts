import type { APIResponse } from '../models/response/APIResponse';
import api, { httpGet, httpPost, httpPut, httpDelete } from "./HttpClient";
import type { DocumentDetailResponse } from "../models/response/document/DocumentDetailResponse";
import type { DocumentRequest } from '../models/request/DocumentRequest';
import type { DocumentStatsResponse } from '../models/response/document/DocumentStatsResponse';
import type { DocumentResponse } from '../models/response/document/DocumentResponse';
import type { DocumentUserResponse } from '../models/response/document/DocumentUserResponse';
import type { DocumentAdminResponse } from '../models/response/document/DocumentAdminResponse';
import type { RatingAdminResponse } from '../models/response/rating/RatingAdminResponse';
import type { ReportAdminResponse } from '../models/response/report/ReportAdminResponse';

export const stats = async () => {
    return await httpGet<APIResponse<DocumentStatsResponse>>(`/documents/stats`);
};

export const search = async (keyword: string, categoryId: number | null) => {
    const url =
        `/documents/search?` +
        (keyword?.trim() ? `keyword=${keyword.trim()}` : "") +
        (keyword?.trim() && categoryId != null ? "&" : "") +
        (categoryId != null ? `categoryId=${categoryId}` : "");

    return await httpGet<APIResponse<DocumentResponse>>(url);
};

export const getPublicDocumentById = async (id: number) => {
    return await httpGet<APIResponse<DocumentDetailResponse>>(`/documents/${id}`);
};

export const getAllPublicDocument = async () => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents`);
};

export const getAllDocument = async () => {
    return await httpGet<APIResponse<DocumentAdminResponse>>(`/documents/admin`);
};

export const increaseView = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/documents/view/${id}`);
};

export const increaseDownload = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/documents/download/${id}`);
};

export const uploadDocument = async (file: File, documentData: DocumentRequest): Promise<APIResponse<DocumentDetailResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(documentData));

    const response = await api.post<APIResponse<DocumentDetailResponse>>("/documents/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

export const downloadFile = async (documentId: number): Promise<Blob> => {
    if (!documentId) {
        throw new Error("Thiếu ID document để tải xuống");
    }

    const response = await api.get<Blob>(`/documents/${documentId}/download`, {
        responseType: "blob",
    });

    return response.data;
};

export const getMyDocument = async () => {
    return await httpGet<APIResponse<DocumentUserResponse>>(`/documents/my-document`);
};

export const getDetailMyDocument = async (id: number): Promise<APIResponse<DocumentDetailResponse>> => {
    return await httpGet<APIResponse<DocumentDetailResponse>>(`/documents/my-document/${id}`);
};

export const createMyDocument = async (documentData: DocumentRequest): Promise<APIResponse<DocumentUserResponse>> => {
    return await httpPost<APIResponse<DocumentUserResponse>>(`/documents/my-document`, documentData);
};

export const updateMyDocument = async (id: number, documentData: DocumentRequest): Promise<APIResponse<DocumentUserResponse>> => {
    return await httpPut<APIResponse<DocumentUserResponse>>(`/documents/my-document/${id}`, documentData);
};

export const deleteMyDocument = async (id: number): Promise<APIResponse<void>> => {
    return await httpDelete<APIResponse<void>>(`/documents/my-document/${id}`);
};

export const getListDocumentByUser = async (userId: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/user/${userId}`);
};

export const getAllDocumentByUser = async (documentId: number, userId: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/user?documentId=${documentId}&userId=${userId}`);
};

export const getAllDocumentByCategory = async (documentId: number, categoryId: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/category?documentId=${documentId}&categoryId=${categoryId}`);
};

export const countMyDocument = async () => {
    return await httpGet<APIResponse<number>>(`/documents/my-document/count`);
};

export const countDocumentOfUser = async (userId: number) => {
    return await httpGet<APIResponse<number>>(`/documents/count/${userId}`);
};

export const getAllDocumentRatingSummary = async () => {
    return await httpGet<APIResponse<RatingAdminResponse>>(`/ratings/admin/document`);
};

export const getAllDocumentReportSummary = async () => {
    return await httpGet<APIResponse<ReportAdminResponse>>(`/reports/admin/document`);
};

export const deleteDocument = async (id: number): Promise<APIResponse<void>> => {
    return await httpDelete<APIResponse<void>>(`/documents/admin/${id}`);
};

export const updateDocument = async (id: number, documentData: DocumentRequest): Promise<APIResponse<DocumentDetailResponse>> => {
    return await httpPut<APIResponse<DocumentDetailResponse>>(`/documents/admin/${id}`, documentData);
};

export const getDocumentById = async (id: number) => {
    return await httpGet<APIResponse<DocumentDetailResponse>>(`/documents/admin/${id}`);
};