import { httpGet, httpPost, httpPut } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { UserResponse } from "../models/response/user/UserResponse";
import type { UserBioResponse } from "../models/response/user/UserBioResponse";
import type { UserRequest } from "../models/request/UserRequest";
import type { ChangePasswordRequest } from "../models/request/ChangePasswordRequest";
import type { ChangeUserInfoRequest } from "../models/request/ChangeUserInfoRequest";
import api from "./HttpClient";
import type { HideRequest } from "../models/request/DisplayRequest";

export const checkEmailExist = async (email: string) => {
    return await httpGet<APIResponse<boolean>>(`/users/email/${email}`);
}

export const checkUsernameExist = async (username: string) => {
    return await httpGet<APIResponse<boolean>>(`/users/username/${username}`);
}

export const getMyInfo = async () => {
    return await httpGet<APIResponse<UserResponse>>(`/users/my-info`);
}

export const getUserInfo = async (id: number) => {
    return await httpGet<APIResponse<UserBioResponse>>(`/users/info/${id}`);
}

export const updateMyInfo = async (avt: File | null, data: ChangeUserInfoRequest) => {
    const formData = new FormData();
    if (avt) {
        formData.append("avt", avt);
    }
    formData.append("data", JSON.stringify(data));

    const response = await api.put<APIResponse<UserResponse>>("/users/my-info", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

export const searchUsers = async (keyword: string) => {
    return await httpGet<APIResponse<UserBioResponse>>(`/users/search?keyword=${keyword}`);
}

export const changePassword = async (data: ChangePasswordRequest) => {
    return await httpPut<APIResponse<void>>(`/users/change-password`, data);
}

// Admin APIs
export const getAllUser = async () => {
    return await httpGet<APIResponse<UserResponse>>(`/users/admin`);
}

export const createUser = async (data: UserRequest) => {
    return await httpPost<APIResponse<UserResponse>>(`/users/admin`, data);
}

export const hideUser = async (id: number, data: HideRequest) => {
    return await httpPut<APIResponse<UserResponse>>(`/users/admin/hide/${id}`, data);
}