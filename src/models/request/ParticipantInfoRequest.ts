import type { ChatRole } from "../enum/common";

export interface ParticipantInfoRequest {
    userId: number;
    conversationId: number;
    chatRole: ChatRole;
}
