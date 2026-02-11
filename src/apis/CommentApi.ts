import { httpDelete, httpGet, httpPost, httpPut } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { CommentRequest } from "../models/request/CommentRequest";
import type { CommentTreeResponse } from "../models/response/CommentTreeResponse";
import type { CommentResponse } from "../models/response/CommentResponse";
import type { HideRequest } from "../models/request/HideRequest";

export const getCommentsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<CommentTreeResponse[]>>(`/comments/document/${documentId}`) as APIResponse<CommentTreeResponse[]>;
}

export const createDocumentComment = async (data: CommentRequest) => {
    return await httpPost<APIResponse<CommentResponse>>(`/comments/document`, data);
}

export const getCommentsByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<CommentTreeResponse[]>>(`/comments/lesson/${lessonId}`) as APIResponse<CommentTreeResponse[]>;
}

export const createLessonComment = async (data: CommentRequest) => {
    return await httpPost<APIResponse<CommentResponse>>(`/comments/lesson`, data);
}

export const getAllComments = async () => {
    return await httpGet<APIResponse<CommentResponse>>(`/comments/admin`) as APIResponse<CommentResponse>;
}

export const hideComment = async (id: number, data: HideRequest) => {
    return await httpPut<APIResponse<CommentResponse>>(`/comments/admin/hide/${id}`, data);
}

export const deleteComment = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/comments/admin/${id}`);
}