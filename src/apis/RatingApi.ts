import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { RatingRequest } from "../models/request/RatingRequest";
import type { RatingUserResponse } from "../models/response/rating/RatingUserResponse";
import type { RatingSummaryResponse } from "../models/response/rating/RatingSummaryResponse";
import type { RatingDetailAdminResponse } from "../models/response/rating/RatingDetailAdminResponse";
import type { RatingAdminResponse } from "../models/response/rating/RatingAdminResponse";

export const getRatingSummaryByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<RatingSummaryResponse>>(`/ratings/document-summary/${documentId}`);
}

export const getRatingSummaryByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<RatingSummaryResponse>>(`/ratings/lesson-summary/${lessonId}`);
}

export const getMyRatingByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<number>>(`/ratings/document/my-rating/${documentId}`);
}

export const getMyRatingByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<number>>(`/ratings/lesson/my-rating/${lessonId}`);
}

export const createRating = async (data: RatingRequest) => {
    return await httpPost<APIResponse<RatingUserResponse>>(`/ratings`, data);
}

// Admin APIs
export const getRatingsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<RatingDetailAdminResponse>>(`/ratings/admin/document/${documentId}`);
}

export const getRatingsByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<RatingDetailAdminResponse>>(`/ratings/admin/lesson/${lessonId}`);
}

export const getAllDocumentRatingSummary = async () => {
    return await httpGet<APIResponse<RatingAdminResponse>>(`/ratings/admin/document`);
}

export const getAllLessonRatingSummary = async () => {
    return await httpGet<APIResponse<RatingAdminResponse>>(`/ratings/admin/lesson`);
}

