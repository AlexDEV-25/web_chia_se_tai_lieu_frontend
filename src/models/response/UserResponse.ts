import type { RoleResponse } from "./RoleResponse";

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    password: string;
    verified: boolean;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
    roles: RoleResponse[];
    hide: boolean;
}
