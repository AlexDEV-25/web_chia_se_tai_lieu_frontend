import { httpGet } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";

export const checkEmailExist = async (email: string) => {
    return await httpGet<APIResponse<boolean>>(`/users/email/${email}`);
}

export const checkUsernameExist = async (username: string) => {
    return await httpGet<APIResponse<boolean>>(`/users/username/${username}`);
}
