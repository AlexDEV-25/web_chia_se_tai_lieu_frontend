import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { RatingRequest } from "../models/request/RatingRequest";
import type { RatingResponse } from "../models/response/RatingResponse";

export const getRatingsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<RatingResponse>>(`/ratings/document/${documentId}`);
}

export const createRatingDocument = async (data: RatingRequest) => {
    return await httpPost<APIResponse<RatingResponse>>(`/ratings/document`, data);
}

export const getRatingsByLesson = async (lessonId: number) => {
    return await httpGet<APIResponse<RatingResponse>>(`/ratings/lesson/${lessonId}`);
}

export const createRatingLesson = async (data: RatingRequest) => {
    return await httpPost<APIResponse<RatingResponse>>(`/ratings/lesson`, data);
}

