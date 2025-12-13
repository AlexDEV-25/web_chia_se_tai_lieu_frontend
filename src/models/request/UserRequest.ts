export interface UserRequest {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    hide: boolean;
}
