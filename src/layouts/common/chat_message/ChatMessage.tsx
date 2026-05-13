import { useEffect, useState, useContext, useRef } from "react";

import { AppContext } from "../../../AppContext";

import { getMyMessages } from "../../../apis/ChatMessageApi";
import { getDetailConversations } from "../../../apis/ConversationApi";
import WebSocketService from "../../../apis/WebSocketService";

import type { ChatMessageResponse } from "../../../models/response/chatmessage/ChatMessageResponse";

import ChatHeader from "./component/ChatHeader";
import MessageList from "./component/MessageList";
import ChatInput from "./component/ChatInput";
import type { ChatMessageRequest } from "../../../models/request/ChatMessageRequest";

// Get current user ID from token
const getCurrentUserName = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub ? payload.sub : null;
    } catch {
        return null;
    }
};

export default function ChatMessage() {

    const context = useContext(AppContext) as any;

    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [conversationName, setConversationName] = useState("");
    const [conversationAvatar, setConversationAvatar] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const unsubscribeRef = useRef<(() => void) | null>(null);
    const currentUserNameRef = useRef<string | null>(null);

    useEffect(() => {
        if (!context.conversationId) {
            return;
        }
        const loadMessages = async () => {
            try {
                setIsLoading(true);

                const userName = getCurrentUserName();
                currentUserNameRef.current = userName;

                const response = await getMyMessages(context.conversationId);
                const messages = response.resultList || [];
                setMessages(messages);
            } finally {
                setIsLoading(false);
            }
        };
        loadMessages();
    }, [context.conversationId]);

    useEffect(() => {
        if (!context.conversationId) {
            return;
        }
        const fetchConversation = async () => {
            const response =
                await getDetailConversations(context.conversationId);
            setConversationName(
                response.result?.conversationName || ""
            );
            setConversationAvatar(
                response.result?.conversationAvatar || ""
            );
        };
        fetchConversation();
    }, [context.conversationId]);

    useEffect(() => {
        if (!context.conversationId) {
            return;
        }
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        const subscribe = async () => {

            let retries = 0;

            while (
                !WebSocketService.getIsConnected()
                && retries < 20
            ) {
                await new Promise(
                    resolve => setTimeout(resolve, 500)
                );
                retries++;
            }

            if (!WebSocketService.getIsConnected()) {
                console.warn("[ChatMessage] WebSocket connection timeout");
                return;
            }

            const unsubscribe =
                WebSocketService.subscribe(
                    `/topic/conversation/${context.conversationId}`,
                    (newMessage: ChatMessageResponse) => {
                        console.log("[ChatMessage] New message received:", newMessage);

                        setMessages(prev => {

                            const exists =
                                prev.some(
                                    m => m.id === newMessage.id
                                );

                            if (exists) {
                                console.log("[ChatMessage] Message already exists, skipping duplicate");
                                return prev;
                            }

                            // Fix `me` field based on current user ID
                            const messageWithCorrectMe = {
                                ...newMessage,
                                me: newMessage.userName === currentUserNameRef.current
                            };

                            console.log("[ChatMessage] Adding message, me:", messageWithCorrectMe.me);
                            return [...prev, messageWithCorrectMe];
                        });
                    }
                );

            unsubscribeRef.current = unsubscribe;
        };

        subscribe();

        return () => {

            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };

    }, [context.conversationId]);

    const handleSendMessage = (
        message: string
    ) => {
        const newMessage: ChatMessageRequest = {
            conversationId: context.conversationId,
            message
        };
        WebSocketService.send(
            "/app/chat",
            newMessage
        );
    };

    return (
        <div className={`chat-popup ${isMinimized ? "chat-popup-minimized" : ""}`}>

            <ChatHeader
                avatar={conversationAvatar}
                name={conversationName}
                isMinimized={isMinimized}
                onClose={() => context.setConversationId(null)}
                onMinimize={() => setIsMinimized(!isMinimized)}
            />

            {!isMinimized && (
                <>
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                    />

                    <ChatInput
                        onSend={handleSendMessage}
                    />
                </>
            )}
        </div>
    );
}