import type { APIResponse } from './../models/response/APIResponse';
import { httpPost, httpDelete, httpGet } from "./HttpClient";
import type { FavoriteResponse } from "./../models/response/FavoriteResponse";
import type { FavoriteRequest } from "./../models/request/FavoriteRequest"

export const addFavorite = async (data: FavoriteRequest) => {
    return await httpPost<APIResponse<FavoriteResponse>>(`/favorites`, data);
};

export const removeFavorite = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/favorites/${id}`);
};

export const getFavoritesByUser = async () => {
    return await httpGet<APIResponse<FavoriteResponse>>(`/favorites/user`);
};