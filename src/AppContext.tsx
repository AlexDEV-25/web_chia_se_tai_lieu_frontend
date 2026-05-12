
import { createContext, useState } from "react";

const AppContext = createContext({});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [conversationName, setConversationName] = useState<string | null>(null);
    const [conversationAvatar, setConversationAvatar] = useState<string | null>(null);

    const value = {
        conversationId,
        setConversationId,
        conversationName,
        setConversationName,
        conversationAvatar,
        setConversationAvatar
    }
    return (
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider }


