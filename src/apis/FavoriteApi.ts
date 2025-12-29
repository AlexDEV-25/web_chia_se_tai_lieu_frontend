import type { APIResponse } from "../models/response/APIResponse";
import { httpDelete, httpGet, httpPost } from "./HttpClient";
import type { FavoriteDocumentRequest } from "../models/request/FavoriteDocumentRequest";
import type { FavoriteDocumentResponse } from "../models/response/FavoriteDocumentResponse";
import type { FavoriteLessonRequest } from "../models/request/FavoriteLessonRequest";
import type { FavoriteLessonResponse } from "../models/response/FavoriteLessonResponse";

export const addFavoriteDocument = async (data: FavoriteDocumentRequest) => {
    return await httpPost<APIResponse<FavoriteDocumentResponse>>(`/favorites/document`, data);
};

export const addFavoriteLesson = async (data: FavoriteLessonRequest) => {
    return await httpPost<APIResponse<FavoriteLessonResponse>>(`/favorites/lesson`, data);
};

export const getDocumentFavoritesByUser = async () => {
    return await httpGet<APIResponse<FavoriteDocumentResponse>>(`/favorites/document/user`);
};

export const getLessonFavoritesByUser = async () => {
    return await httpGet<APIResponse<FavoriteLessonResponse>>(`/favorites/lesson/user`);
};

export const removeFavorite = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/favorites/${id}`);
};

// Backwards-compatible exports for existing document-only flows
export const addFavorite = addFavoriteDocument;
export const getFavoritesByUser = getDocumentFavoritesByUser;