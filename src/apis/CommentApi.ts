import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { CommentResponse } from "../models/response/CommentResponse";
import type { CommentRequest } from "../models/request/CommentRequest";

export const getCommentsByDocument = (documentId: number) =>
    httpGet<APIResponse<CommentResponse>>(`/comments/document/${documentId}`);

export const createComment = (payload: CommentRequest) =>
    httpPost<APIResponse<CommentResponse>>(`/comments`, payload);

