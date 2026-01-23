import type { APIResponse } from './../models/response/APIResponse';
import api, { httpGet, httpPost } from "./HttpClient";
import type { DocumentResponse } from "./../models/response/DocumentResponse";
import type { DocumentRequest } from "./../models/request/DocumentReques";
import type { HideRequest } from '../models/request/HideRequest';

export const getAllDocumentByCategory = async (id: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/category/${id}`);
}

export const getAllDocumentByUser = async (id: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/user/${id}`);
}

export const getDocumentById = async (id: number) => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/${id}`);
}

export const getAllDocument = async () => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents`);
}

export const increaseView = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/documents/view/${id}`);
}

export const increaseDownload = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/documents/download/${id}`);
}

export const downloadFile = async (documentId: number): Promise<Blob> => {
    if (!documentId) {
        throw new Error("Thiếu ID document để tải xuống");
    }

    const response = await api.get<Blob>(`/documents/${documentId}/download`, {
        responseType: "blob",
    });

    return response.data;
};

export const uploadDocument = async (file: File, documentData: DocumentRequest): Promise<APIResponse<DocumentResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(documentData));

    const response = await api.post<APIResponse<DocumentResponse>>("/documents/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

export const deleteDocument = async (id: number): Promise<APIResponse<void>> => {
    const response = await api.delete<APIResponse<void>>(`/documents/${id}`);
    return response.data;
}

export const getMyDocument = async () => {
    return await httpGet<APIResponse<DocumentResponse>>(`/documents/my-document`);
}

export const updateMyDocument = async (id: number, documentData: DocumentRequest): Promise<APIResponse<DocumentResponse>> => {
    const response = await api.put<APIResponse<DocumentResponse>>(`/documents/my-document/${id}`, documentData);
    return response.data;
}

export const deleteMyDocument = async (id: number): Promise<APIResponse<void>> => {
    const response = await api.delete<APIResponse<void>>(`/documents/my-document/${id}`);
    return response.data;
}

export const hideDocument = async (id: number, data: HideRequest): Promise<APIResponse<DocumentResponse>> => {
    const response = await api.put<APIResponse<DocumentResponse>>(`/documents/hide/${id}`, data);
    return response.data;
}

export const updateDocument = async (id: number, documentData: DocumentRequest): Promise<APIResponse<DocumentResponse>> => {
    const response = await api.put<APIResponse<DocumentResponse>>(`/documents/${id}`, documentData);
    return response.data;
}