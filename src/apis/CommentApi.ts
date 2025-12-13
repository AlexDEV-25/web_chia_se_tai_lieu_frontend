import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { CommentResponse } from "../models/response/CommentResponse";
import type { CommentRequest } from "../models/request/CommentRequest";

export const getCommentsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<CommentResponse>>(`/comments/document/${documentId}`);
}

export const createComment = async (data: CommentRequest) => {
    return await httpPost<APIResponse<CommentResponse>>(`/comments`, data);
}
