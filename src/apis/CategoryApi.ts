import type { APIResponse } from './../models/response/APIResponse';
import { httpGet, httpPost, httpPut, httpDelete } from "./HttpClient";
import type { CategoryResponse } from "./../models/response/CategoryResponse";
import type { CategoryRequest } from "./../models/request/CategoryRequest"
import type { HideRequest } from '../models/request/HideRequest';

export const getAllCategory = async () => {
    return await httpGet<APIResponse<CategoryResponse>>(`/categories/admin`);
}

export const getAllPublicCategory = async () => {
    return await httpGet<APIResponse<CategoryResponse>>(`/categories`);
}

export const getCategoryById = async (id: number) => {
    return await httpGet<APIResponse<CategoryResponse>>(`/categories/admin/${id}`);
}

export const createCategory = async (data: CategoryRequest) => {
    return await httpPost<APIResponse<CategoryResponse>>(`/categories/admin`, data);
}

export const updateCategory = async (id: number, data: CategoryRequest) => {
    return await httpPut<APIResponse<CategoryResponse>>(`/categories/admin/${id}`, data);
}

export const hideCategory = async (id: number, data: HideRequest) => {
    return await httpPut<APIResponse<CategoryResponse>>(`/categories/admin/hide/${id}`, data);
}

export const deleteCategory = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/categories/admin/${id}`);
}