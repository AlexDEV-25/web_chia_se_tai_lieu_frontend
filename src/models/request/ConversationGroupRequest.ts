import type { ConversationRequest } from "./ConversationRequest";

export interface ConversationGroupRequest extends ConversationRequest {
    groupName: string;
}
