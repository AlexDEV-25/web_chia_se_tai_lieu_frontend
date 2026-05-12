import type { APIResponse } from '../models/response/APIResponse';
import { httpGet, httpPost } from "./HttpClient";
import type { ConversationRequest } from '../models/request/ConversationRequest';
import type { ConversationResponse } from '../models/response/conversation/ConversationResponse';

export const getMyConversation = async () => {
    return await httpGet<APIResponse<ConversationResponse>>(`/conversations/my-conversations`);
}

export const createDirectConversation = async (data: ConversationRequest) => {
    return await httpPost<APIResponse<ConversationResponse>>(`/conversations/direct`, data);
}

export const createGroupConversation = async (data: ConversationRequest) => {
    return await httpPost<APIResponse<ConversationResponse>>(`/conversations/group`, data);
}

export const searchConversations = async (keyword: string) => {
    return await httpGet<APIResponse<ConversationResponse>>(`/conversations/search?keyword=${keyword}`);
}