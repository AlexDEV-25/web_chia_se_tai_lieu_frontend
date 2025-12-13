import type { APIResponse } from './../models/response/APIResponse';
import api, { httpGet, httpPost } from "./HttpClient";
import type { DocumentResponse } from "./../models/response/DocumentResponse";

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

export const downloadFile = async (fileName: string): Promise<Blob> => {
    if (!fileName) {
        throw new Error("Thiếu tên file để tải xuống");
    }

    const response = await api.get<Blob>(`/documents/download-file`, {
        params: { fileName },
        responseType: "blob",
    });

    return response.data;
}