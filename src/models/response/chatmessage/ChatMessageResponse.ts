import type { ConnectionStatus } from "../../enum/common";

export interface ChatMessageResponse {
    id: number;
    conversationId: number;
    me: boolean;
    message: string;
    userId: number;
    userName: string;
    userAvatar: string;
    userStatus: ConnectionStatus;
    createdAt: string;
}