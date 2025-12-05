import { httpGet } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";

export const checkEmailExist = (email: string) =>
    httpGet<APIResponse<boolean>>(`/users/email/${email}`);

export const checkUsernameExist = (username: string) =>
    httpGet<APIResponse<boolean>>(`/users/username/${username}`);
