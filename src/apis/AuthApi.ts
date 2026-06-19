import type { UserResponse } from "../models/response/user/UserResponse";
import type { UserRequest } from "../models/request/UserRequest";
import type { AuthenticationRequest } from "../models/request/AuthenticationRequest";
import { httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { AuthenticationResponse } from "../models/response/authentication/AuthenticationResponse";
import type { IntrospectResponse } from "../models/response/authentication/IntrospectResponse";
import type { ActiveAccountRequest } from "../models/request/ActiveAccountRequest";
import type { ForgotPasswordRequest } from "../models/request/ForgotPasswordRequest";
import type { UserBioResponse } from "../models/response/user/UserBioResponse";
import type { TokenRequest } from "../models/request/TokenRequest";

export const register = (data: UserRequest) =>
    httpPost<APIResponse<UserResponse>>(`/auth/register`, data);

export const login = async (data: AuthenticationRequest) => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in`, data);
}

export const loginWithGoogle = async (code: string) => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in-google?code=${code}`);
}

export const activateUser = async (data: ActiveAccountRequest) => {
    return await httpPost<APIResponse<void>>(`/auth/activate`, data);
}

export const forgotPassword = async (email: string) => {
    return await httpPost<APIResponse<void>>(`/auth/forgot-password?email=${email}`);
}

export const changePassword = async (data: ForgotPasswordRequest) => {
    return await httpPost<APIResponse<UserBioResponse>>(`/auth/change-password`, data);
}

export const refreshToken = async (data: TokenRequest) => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/refresh-token`, data);
}

export const introspect = async (data: TokenRequest) => {
    return await httpPost<APIResponse<IntrospectResponse>>(`/auth/introspect`, data);
}