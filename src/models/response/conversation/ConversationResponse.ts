import type { ParticipantInfoResponse } from "../participantInfo/ParticipantInfoResponse";

export interface ConversationResponse {
    id: number;
    type: string;
    conversationAvatar: string;
    conversationName: string;
    participantInfos: ParticipantInfoResponse[];
}
