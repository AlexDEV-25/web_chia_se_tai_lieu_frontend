import type { APIResponse } from '../models/response/APIResponse';
import { httpGet } from "./HttpClient";
import type { ChatMessageResponse } from '../models/response/chatmessage/ChatMessageResponse';

export const getMyMessages = async (conversationId: number) => {
    return await httpGet<APIResponse<ChatMessageResponse>>(`/chat-messages/my-conversation-messages/${conversationId}`);
}
