
import { createContext, useState } from "react";

const AppContext = createContext({});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [roles, setRoles] = useState<string[]>(JSON.parse(localStorage.getItem("roles") || "[]"));
    const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('avatar'));
    const [keyword, setKeyword] = useState<string | null>('');

    const value = {
        conversationId,
        setConversationId,
        token,
        setToken,
        roles,
        setRoles,
        avatar,
        setAvatar,
        keyword,
        setKeyword
    }
    return (
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider }


