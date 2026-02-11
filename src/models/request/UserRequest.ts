export interface UserRequest {
    username: string;
    email: string;
    password: string;
    bio: string;
    verified: boolean;
    roles: string[];
    hide: boolean;
}
