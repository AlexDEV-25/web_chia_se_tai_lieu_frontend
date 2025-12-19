import axios from "axios";
import { httpPost } from "./HttpClient";
import type { APIResponse } from './../models/response/APIResponse';
import type { AuthenticationResponse } from "../models/response/AuthenticationResponse";
export const getUserDetails = async (accessToken: string) => {
    return await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
            params: {
                alt: "json",
                access_token: accessToken,
            },
        }
    );
};

export const exchangeToken = async (code: string) => {
    return await httpPost<APIResponse<AuthenticationResponse>>(`/auth/log-in-google?code=${code}`);
}