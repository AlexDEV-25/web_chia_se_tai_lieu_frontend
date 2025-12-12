import type { UserResponse } from "../models/response/UserResponse";
import User from "../models/request/UserRequest";
import AuthenticationRequest from "../models/request/AuthenticationRequest";
import { httpGet, httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { AuthenticationResponse } from "../models/response/AuthenticationResponse";
import type { IntrospectResponse } from "../models/response/IntrospectResponse";
export const register = (data: User) =>
    httpPost<APIResponse<UserResponse>>(`/auth/register`, data);

export const login = (data: AuthenticationRequest) =>
    httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in`, data);

export const activateUser = (email: string, activationCode: string) =>
    httpGet<APIResponse<void>>(`/auth/activate?email=${email}&activationCode=${activationCode}`);

export const logout = () => httpPost<APIResponse<void>>(`/auth/log-out`);

export const refreshToken = () => httpPost<APIResponse<AuthenticationResponse>>(`/auth/refresh-token`);

export const introspect = () => httpPost<APIResponse<IntrospectResponse>>(`/auth/introspect`);