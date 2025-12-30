import { httpGet, httpPost, httpPut } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { UserResponse } from "../models/response/UserResponse";
import type { UserRequest } from "../models/request/UserRequest";
import type { HideRequest } from "../models/request/HideRequest";

export const checkEmailExist = async (email: string) => {
    return await httpGet<APIResponse<boolean>>(`/users/email/${email}`);
}

export const checkUsernameExist = async (username: string) => {
    return await httpGet<APIResponse<boolean>>(`/users/username/${username}`);
}
export const getMyInfo = async () => {
    return await httpGet<APIResponse<UserResponse>>(`/users/my-info`);
}

export const checkPasswordExist = async () => {
    return await httpGet<APIResponse<boolean>>(`/users/check-password`);
}

export const createPassword = async (password: string) => {
    return await httpPost<APIResponse<void>>(`/users/create-password`, { password });
}

export const createUser = async (data: UserRequest) => {
    return await httpPost<APIResponse<UserResponse>>(`/users`, data);
}

export const hideUser = async (id: number, data: HideRequest) => {
    return await httpPut<APIResponse<UserResponse>>(`/users/hide/${id}`, data);
}

export const getAllUser = async () => {
    return await httpGet<APIResponse<UserResponse>>(`/users`);
}