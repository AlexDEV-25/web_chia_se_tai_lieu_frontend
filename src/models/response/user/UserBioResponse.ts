import type { ConnectionStatus } from "../../enum/common";

export interface UserBioResponse {
    id: number;
    username: string;
    avatarUrl: string;
    bio: string;
    status: ConnectionStatus;
}
