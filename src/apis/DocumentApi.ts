import type { APIResponse } from './../models/response/APIResponse';
import { httpGet } from "./HttpClient";
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