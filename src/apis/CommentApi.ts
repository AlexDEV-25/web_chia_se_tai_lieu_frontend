import { httpDelete, httpGet, httpPost, httpPut } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { CommentRequest } from "../models/request/CommentRequest";
import type { CommentTreeResponse } from "../models/response/comment/CommentTreeResponse";
import type { CommentResponse } from "../models/response/comment/CommentResponse";
import type { HideRequest } from "../models/request/HideRequest";

export const createComment = async (data: CommentRequest) => {
    return await httpPost<APIResponse<CommentResponse>>(`/comments`, data);
}

export const updateComment = async (id: number, data: CommentRequest) => {
    return await httpPut<APIResponse<CommentResponse>>(`/comments/${id}`, data);
}

export const getCommentsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<CommentTreeResponse[]>>(`/comments/document/${documentId}`);
}

export const getCommentsByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<CommentTreeResponse[]>>(`/comments/lesson/${lessonId}`);
}

export const getAllComments = async () => {
    return await httpGet<APIResponse<CommentResponse>>(`/comments/admin`);
}

export const hideComment = async (id: number, data: HideRequest) => {
    return await httpPut<APIResponse<CommentResponse>>(`/comments/admin/hide/${id}`, data);
}

export const hideMyComment = async (id: number) => {
    return await httpPut<APIResponse<CommentResponse>>(`/comments/hide/${id}`, {});
}

export const deleteComment = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/comments/admin/${id}`);
}