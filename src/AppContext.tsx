
import { createContext, useState } from "react";

const AppContext = createContext({});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [conversationId, setConversationId] = useState<number | null>(null);

    const value = {
        conversationId,
        setConversationId
    }
    return (
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider }


