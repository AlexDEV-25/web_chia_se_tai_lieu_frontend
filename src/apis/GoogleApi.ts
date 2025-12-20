import { httpPost } from "./HttpClient";
import type { APIResponse } from './../models/response/APIResponse';
import type { AuthenticationResponse } from "../models/response/AuthenticationResponse";

export const exchangeToken = async (code: string) => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in-google?code=${code}`);
}