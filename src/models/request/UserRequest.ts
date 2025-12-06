export default class UserRequest {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    hide: boolean;

    constructor(
        username: string,
        email: string,
        password: string,
        verified: boolean,
        createdAt: string,
        updatedAt: string,
        roles: string[],
        hide: boolean = false
    ) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.verified = verified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.roles = roles;
        this.hide = hide;
    }
}
