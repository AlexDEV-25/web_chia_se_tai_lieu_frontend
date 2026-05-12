import type { ChatRole, ConnectionStatus } from "../../enum/common";

export interface ParticipantInfoResponse {
    id: number;
    userId: number;
    userName: string;
    lastSeen: string;
    chatRole: ChatRole;
    userStatus: ConnectionStatus;
}