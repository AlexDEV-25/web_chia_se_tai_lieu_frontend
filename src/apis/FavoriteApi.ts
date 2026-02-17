import type { APIResponse } from "../models/response/APIResponse";
import { httpDelete, httpGet, httpPost } from "./HttpClient";
import type { FavoriteRequest } from "../models/request/FavoriteRequest";
import type { FavoriteResponse } from "../models/response/FavoriteResponse";

export const addFavoriteDocument = async (data: FavoriteRequest) => {
    return await httpPost<APIResponse<FavoriteResponse>>(`/favorites/document`, data);
};

export const addFavoriteLesson = async (data: FavoriteRequest) => {
    return await httpPost<APIResponse<FavoriteResponse>>(`/favorites/lesson`, data);
};

export const getDocumentFavoritesByUser = async () => {
    return await httpGet<APIResponse<FavoriteResponse>>(`/favorites/document/user`);
};

export const getLessonFavoritesByUser = async () => {
    return await httpGet<APIResponse<FavoriteResponse>>(`/favorites/lesson/user`);
};
export const removeFavorite = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/favorites/${id}`);
};

export const removeDocumentFavorite = async (documentId: number) => {
    return await httpDelete<APIResponse<void>>(`/favorites/document/${documentId}`);
};

export const removeLessonFavorite = async (lessonId: number) => {
    return await httpDelete<APIResponse<void>>(`/favorites/lesson/${lessonId}`);
};

export const checkDocumentFavorite = async (documentId: number) => {
    return await httpGet<APIResponse<boolean>>(`/favorites/document/user/check/${documentId}`);
};

export const checkLessonFavorite = async (lessonId: number) => {
    return await httpGet<APIResponse<boolean>>(`/favorites/lesson/user/check/${lessonId}`);
};

// Backwards-compatible exports for existing document-only flows
export const addFavorite = addFavoriteDocument;
export const getFavoritesByUser = getDocumentFavoritesByUser;