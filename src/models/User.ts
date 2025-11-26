export class User {
    id: number;
    fullName: string;
    email: string;
    password: string;
    isVerified: boolean;
    avatarUrl?: string;
    avatarData?: string;
    createdAt?: string;
    updatedAt?: string;
    role?: string;
    hide: boolean;
    constructor(
        id: number,
        fullName: string,
        email: string,
        password: string,
        isVerified: boolean = false,
        avatarUrl?: string,
        avatarData?: string,
        createdAt?: string,
        updatedAt?: string,
        role?: string,
        hide: boolean = false
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.isVerified = isVerified;
        this.avatarUrl = avatarUrl;
        this.avatarData = avatarData;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.role = role;
        this.hide = hide;
    }
}