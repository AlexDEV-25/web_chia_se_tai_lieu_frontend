import type { APIResponse } from './../models/response/APIResponse';
import api, { httpGet } from "./HttpClient";
import type { ChatHistoryResponse } from "./../models/response/ChatHistoryResponse";

export const chatbot = async (file: File, message: string): Promise<APIResponse<string>> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("message", message);

    const response = await api.post<APIResponse<string>>("/chats", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

export const getAllHistoryByUser = async () => {
    return await httpGet<APIResponse<ChatHistoryResponse>>(`/chats`);
}