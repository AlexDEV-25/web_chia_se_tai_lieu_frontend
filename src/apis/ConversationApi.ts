import type { APIResponse } from '../models/response/APIResponse';
import api, { httpGet, httpPost } from "./HttpClient";
import type { ConversationRequest } from '../models/request/ConversationRequest';
import type { ConversationResponse } from '../models/response/conversation/ConversationResponse';
import type { ConversationGroupRequest } from '../models/request/ConversationGroupRequest';

export const getMyConversation = async () => {
    return await httpGet<APIResponse<ConversationResponse>>(`/conversations/my-conversations`);
}

export const createDirectConversation = async (data: ConversationRequest) => {
    return await httpPost<APIResponse<ConversationResponse>>(`/conversations/direct`, data);
}

export const createGroupConversation = async (avt: File | null, data: ConversationGroupRequest) => {
    const formData = new FormData();
    if (avt) {
        formData.append("avt", avt);
    }
    formData.append("data", JSON.stringify(data));

    const response = await api.post<APIResponse<ConversationResponse>>("/conversations/group", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

export const searchConversations = async (keyword: string) => {
    return await httpGet<APIResponse<ConversationResponse>>(`/conversations/search?keyword=${keyword}`);
}

export const getDetailConversations = async (id: number) => {
    return await httpGet<APIResponse<ConversationResponse>>(`/conversations/detail/${id}`);
}