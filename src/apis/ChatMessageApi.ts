import type { APIResponse } from '../models/response/APIResponse';
import { httpGet } from "./HttpClient";
import type { ConversationResponse } from '../models/response/conversation/ConversationResponse';

export const getMyMessages = async (conversationId: number) => {
    return await httpGet<APIResponse<ConversationResponse>>(`/chat-messages/my-conversation-messages/${conversationId}`);
}
