import type { ConnectionStatus } from "../../enum/common";

export interface ParticipantInfoResponse {
    id: number;
    userId: number;
    userName: string;
    userStatus: ConnectionStatus;
}