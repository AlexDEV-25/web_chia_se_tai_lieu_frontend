import { httpGet, httpPost, httpPut } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { CommentRequest } from "../models/request/CommentRequest";
import type { CommentTreeResponse } from "../models/response/comment/CommentTreeResponse";
import type { CommentResponse } from "../models/response/comment/CommentResponse";
import type { HideRequest } from "../models/request/DisplayRequest";

// ==========================================================================================
// user
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
// ==========================================================================================
// admin
export const getAllDocumentComments = async () => {
    return await httpGet<APIResponse<CommentResponse>>(`/comments/admin/document`);
}

export const getAllLessonComments = async () => {
    return await httpGet<APIResponse<CommentResponse>>(`/comments/admin/lesson`);
}

export const hideComment = async (id: number, data: HideRequest) => {
    return await httpPut<APIResponse<CommentResponse>>(`/comments/admin/hide/${id}`, data);
}

export const filterComment = async (type: string) => {
    return await httpGet<APIResponse<CommentResponse>>(`/comments/admin/filter-comment?type=${type}`);
}