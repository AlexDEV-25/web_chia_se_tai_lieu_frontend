import type { ConversationType } from "../enum/common";

export interface ConversationRequest {
    type: ConversationType;
    participantIds: number[];
}
