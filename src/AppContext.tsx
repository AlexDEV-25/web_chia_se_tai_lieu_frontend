// App.tsx hoặc AppContext.tsx
import { createContext } from "react";
import type { UserResponse } from "./models/response/UserResponse";

export interface AppContextType {
    keyWords: string;
    setKeyWords: (value: string) => void;
}

export interface UserContextType {
    currentUser: UserResponse | null;
    setCurrentUser: (user: UserResponse | null) => void;
    isLoadingUser: boolean;
    setIsLoadingUser: (loading: boolean) => void;
}

// Khởi tạo context với giá trị null ban đầu
export const AppContext = createContext<AppContextType | null>(null);

export const UserContext = createContext<UserContextType | null>(null);
