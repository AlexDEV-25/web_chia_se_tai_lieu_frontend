export interface UserRequest {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    roles: string[];
    hide: boolean;
}
