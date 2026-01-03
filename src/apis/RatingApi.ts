import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { RatingDocumentResponse } from "../models/response/RatingDocumentResponse";
import type { RatingDocumentRequest } from "../models/request/RatingDocumentRequest";
import type { RatingLessonResponse } from "../models/response/RatingLessonResponse";
import type { RatingLessonRequest } from "../models/request/RatingLessonRequest";

export const getRatingsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<RatingDocumentResponse>>(`/ratings/document/${documentId}`);
}

export const createRatingDocument = async (data: RatingDocumentRequest) => {
    return await httpPost<APIResponse<RatingDocumentResponse>>(`/ratings/document`, data);
}

export const getRatingsByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<RatingLessonResponse>>(`/ratings/lesson/${lessonId}`);
}

export const createRatingLesson = async (data: RatingLessonRequest) => {
    return await httpPost<APIResponse<RatingLessonResponse>>(`/ratings/lesson`, data);
}

