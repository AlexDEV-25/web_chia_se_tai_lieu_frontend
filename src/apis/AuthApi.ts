import type { UserResponse } from "../models/response/UserResponse";
import User from "../models/request/UserRequest";
import AuthenticationRequest from "../models/request/AuthenticationRequest";
import { httpPost } from "./HttpClient";
import type { APIResponse } from "../models/response/APIResponse";
import type { AuthenticationResponse } from "../models/response/AuthenticationResponse";

export const register = (data: User) =>
    httpPost<APIResponse<UserResponse>>(`/auth/register`, data);

export const login = (data: AuthenticationRequest) =>
    httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in`, data);
