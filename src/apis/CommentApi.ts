import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { CommentDocumentResponse } from "../models/response/CommentDocumentResponse";
import type { CommentDocumentRequest } from "../models/request/CommentDocumentRequest";

import type { CommentLessonResponse } from "../models/response/CommentLessonResponse";
import type { CommentLessonRequest } from "../models/request/CommentLessonRequest";

export const getCommentsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<CommentDocumentResponse>>(`/comments/document/${documentId}`);
}

export const createDocumentComment = async (data: CommentDocumentRequest) => {
    return await httpPost<APIResponse<CommentDocumentResponse>>(`/comments/document`, data);
}

export const getCommentsByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<CommentLessonResponse>>(`/comments/lesson/${lessonId}`);
}

export const createLessonComment = async (data: CommentLessonRequest) => {
    return await httpPost<APIResponse<CommentLessonResponse>>(`/comments/lesson`, data);
}