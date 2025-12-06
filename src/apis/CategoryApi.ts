import type { APIResponse } from './../models/response/APIResponse';
import { httpGet, httpPost, httpPut, httpDelete } from "./HttpClient";
import type { CategoryResponse } from "./../models/response/CategoryResponse";
import CategoryRequest from "./../models/request/CategoryRequest"

export const createCategory = (data: CategoryRequest) => {
    httpPost<APIResponse<CategoryResponse>>(`/categories`, data);
}

export const updateCategory = (id: number, data: CategoryRequest) => {
    httpPut<APIResponse<CategoryResponse>>(`/categories/${id}`, data);
}

export const deleteCategory = (id: number) => {
    httpDelete<APIResponse<void>>(`/categories/${id}`);
}

export const getAllCategory = async () => {
    return await httpGet<APIResponse<CategoryResponse>>(`/categories`);
}

export const getCategoryById = async (id: number) => {
    return await httpGet<APIResponse<CategoryResponse>>(`/categories/${id}`);
}