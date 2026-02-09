import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { RatingRequest } from "../models/request/RatingRequest";
import type { RatingResponse } from "../models/response/RatingResponse";
import type { RatingSummaryResponse } from "../models/response/RatingSummaryResponse";

export const getRatingsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<RatingResponse>>(`/ratings/document/${documentId}`);
}

export const createRatingDocument = async (data: RatingRequest) => {
    return await httpPost<APIResponse<RatingResponse>>(`/ratings/document`, data);
}

export const getRatingsByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<RatingResponse>>(`admin/ratings/lesson/${lessonId}`);
}

export const createRatingLesson = async (data: RatingRequest) => {
    return await httpPost<APIResponse<RatingResponse>>(`admin/ratings/lesson`, data);
}

export const getMyRatingByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<number>>(`ratings/document/my-rating/${documentId}`);
}

export const getMyRatingByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<number>>(`ratings/lesson/my-rating/${lessonId}`);
}

export const getRatingSummaryByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<RatingSummaryResponse>>(`ratings/document-summary/${documentId}`);
}

export const getRatingSummaryByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<RatingSummaryResponse>>(`ratings/lesson-summary/${lessonId}`);
}

