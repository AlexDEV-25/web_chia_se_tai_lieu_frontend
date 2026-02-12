import type { APIResponse } from './../models/response/APIResponse';
import api, { httpGet, httpPost } from "./HttpClient";
import type { DocumentResponse } from "./../models/response/DocumentResponse";
import type { DocumentRequest } from "./../models/request/DocumentReques";
import type { HideRequest } from '../models/request/HideRequest';
import type { DocumentStatsResponse } from '../models/response/DocumentStatsResponse';

export const stats = async () => {
    return await httpGet<APIResponse<DocumentStatsResponse>>(`/documents/stats`);
};

export const search = async (keyword: string, categoryId: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/search?keyword=${keyword}&categoryId=${categoryId}`);
};

export const getDocumentById = async (id: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/admin/${id}`);
};

export const getPublicDocumentById = async (id: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/${id}`);
};

export const getAllDocument = async () => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/admin`);
};

export const getAllPublicDocument = async () => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents`);
};

export const deleteDocument = async (id: number): Promise<APIResponse<void>> => {
    const response = await api.delete<APIResponse<void>>(`/documents/admin/${id}`);
    return response.data;
};

export const getAllDocumentByUser = async (documentId: number, userId: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/user?documentId=${documentId}&userId=${userId}`);
};

export const getAllDocumentByCategory = async (documentId: number, categoryId: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/category?documentId=${documentId}&categoryId=${categoryId}`);
};

export const hideDocument = async (id: number, data: HideRequest): Promise<APIResponse<DocumentResponse>> => {
    const response = await api.put<APIResponse<DocumentResponse>>(`/documents/admin/hide/${id}`, data);
    return response.data;
};

export const updateDocument = async (id: number, documentData: DocumentRequest): Promise<APIResponse<DocumentResponse>> => {
    const response = await api.put<APIResponse<DocumentResponse>>(`/documents/admin/${id}`, documentData);
    return response.data;
};

export const increaseView = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/documents/view/${id}`);
};

export const increaseDownload = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/documents/download/${id}`);
};

export const uploadDocument = async (file: File, documentData: DocumentRequest): Promise<APIResponse<DocumentResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(documentData));

    const response = await api.post<APIResponse<DocumentResponse>>("/documents/upload-file", formData, {
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
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/my-document`);
};

export const updateMyDocument = async (id: number, documentData: DocumentRequest): Promise<APIResponse<DocumentResponse>> => {
    const response = await api.put<APIResponse<DocumentResponse>>(`/documents/my-document/${id}`, documentData);
    return response.data;
};

export const deleteMyDocument = async (id: number): Promise<APIResponse<void>> => {
    const response = await api.delete<APIResponse<void>>(`/documents/my-document/${id}`);
    return response.data;
};

export const getListDocumentByUser = async (userId: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/user/${userId}`);
};

export const getDocumentFile = async (documentId: number): Promise<Blob> => {
    if (!documentId) {
        throw new Error("Thiếu ID document để tải file");
    }

    const response = await api.get<Blob>(`/documents/admin/${documentId}/file`, {
        responseType: "blob",
    });

    return response.data;
};

export const getPublicDocumentFile = async (documentId: number): Promise<Blob> => {
    if (!documentId) {
        throw new Error("Thiếu ID document để tải file");
    }

    const response = await api.get<Blob>(`/documents/${documentId}/file`, {
        responseType: "blob",
    });

    return response.data;
};