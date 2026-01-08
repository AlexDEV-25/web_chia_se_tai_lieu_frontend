import type { UserResponse } from "../models/response/UserResponse";
import type { UserRequest } from "../models/request/UserRequest";
import type { AuthenticationRequest } from "../models/request/AuthenticationRequest";
import { httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { AuthenticationResponse } from "../models/response/AuthenticationResponse";
import type { IntrospectResponse } from "../models/response/IntrospectResponse";
import type { ActiveAccountRequest } from "../models/request/ActiveAccountRequest";
import type { ChangePasswordRequest } from "../models/request/ChangePasswordRequest";
export const register = (data: UserRequest) =>
    httpPost<APIResponse<UserResponse>>(`/auth/register`, data);

export const login = async (data: AuthenticationRequest) => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in`, data);
}

export const activateUser = async (data: ActiveAccountRequest) => {
    return await httpPost<APIResponse<void>>(`/auth/activate`, data);
}
export const changePassword = async (data: ChangePasswordRequest) => {
    return await httpPost<APIResponse<void>>(`/auth/change-password`, data);
}

export const forgotPassword = async (email: string) => {
    return await httpPost<APIResponse<void>>(`/auth/forgot-password?email=${email}`);
}

export const refreshToken = async () => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/refresh-token`);
}

export const introspect = async () => {
    return await httpPost<APIResponse<IntrospectResponse>>(`/auth/introspect`);
}