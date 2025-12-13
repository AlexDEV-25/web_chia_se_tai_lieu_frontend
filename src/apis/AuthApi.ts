import type { UserResponse } from "../models/response/UserResponse";
import type { UserRequest } from "../models/request/UserRequest";
import type { AuthenticationRequest } from "../models/request/AuthenticationRequest";
import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { AuthenticationResponse } from "../models/response/AuthenticationResponse";
import type { IntrospectResponse } from "../models/response/IntrospectResponse";
export const register = (data: UserRequest) =>
    httpPost<APIResponse<UserResponse>>(`/auth/register`, data);

export const login = async (data: AuthenticationRequest) => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in`, data);
}

export const activateUser = async (email: string, activationCode: string) => {
    return await httpGet<APIResponse<void>>(`/auth/activate?email=${email}&activationCode=${activationCode}`);
}

export const refreshToken = async () => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/refresh-token`);
}

export const introspect = async () => {
    return await httpPost<APIResponse<IntrospectResponse>>(`/auth/introspect`);
}