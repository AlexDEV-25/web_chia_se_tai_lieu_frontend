import type { APIResponse } from './../models/response/APIResponse';
import { httpGet, httpPost, httpPut, httpDelete } from "./HttpClient";
import type { CategoryResponse } from "./../models/response/CategoryResponse";
import type { CategoryRequest } from "./../models/request/CategoryRequest"

export const createCategory = async (data: CategoryRequest) => {
    return await httpPost<APIResponse<CategoryResponse>>(`/categories`, data);
}

export const updateCategory = async (id: number, data: CategoryRequest) => {
    return await httpPut<APIResponse<CategoryResponse>>(`/categories/${id}`, data);
}

export const deleteCategory = async (id: number) => {
    return await httpDelete<APIResponse<void>>(`/categories/${id}`);
}

export const getAllCategory = async () => {
    return await httpGet<APIResponse<CategoryResponse>>(`/categories`);
}

export const getCategoryById = async (id: number) => {
    return await httpGet<APIResponse<CategoryResponse>>(`/categories/${id}`);
}