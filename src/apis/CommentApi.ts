import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { CommentRequest } from "../models/request/CommentRequest";
import type { CommentTreeResponse } from "../models/response/CommentTreeResponse";
import type { CommentResponse } from "../models/response/CommentResponse";

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