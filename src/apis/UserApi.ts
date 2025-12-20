import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { UserResponse } from "../models/response/UserResponse";

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
