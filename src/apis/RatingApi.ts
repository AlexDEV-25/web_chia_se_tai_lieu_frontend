import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { RatingResponse } from "../models/response/RatingResponse";
import type { RatingRequest } from "../models/request/RatingRequest";

export const getRatingsByDocument = async (documentId: number) => {
    return await httpGet<APIResponse<RatingResponse>>(`/ratings/document/${documentId}`);
}

export const createRating = async (data: RatingRequest) => {
    return await httpPost<APIResponse<RatingResponse>>(`/ratings`, data);
}
