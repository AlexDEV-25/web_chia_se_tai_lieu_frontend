import type { RoleResponse } from '../role/RoleResponse';

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    password: string;
    bio: string;
    verified: boolean;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
    roles: RoleResponse[];
    hide: boolean;
}
