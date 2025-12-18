import type { APIResponse } from './../models/response/APIResponse';
import api from "./HttpClient";

export const chatbot = async (file: File, message: string): Promise<APIResponse<string>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(message));

    const response = await api.post<APIResponse<string>>("api/chats", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}