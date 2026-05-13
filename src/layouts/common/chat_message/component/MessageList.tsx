import { useEffect, useRef } from "react";
import type { ChatMessageResponse } from "../../../../models/response/chatmessage/ChatMessageResponse";
import MessageItem from "./MessageItem";



type Props = {
    messages: ChatMessageResponse[];
    isLoading: boolean;
};

export default function MessageList({
    messages,
    isLoading
}: Props) {

    const bottomRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    return (
        <div className="chat-popup-messages">

            {isLoading ? (
                <div className="chat-loading">
                    Đang tải...
                </div>
            ) : messages.length === 0 ? (
                <div className="chat-empty">
                    Chưa có tin nhắn
                </div>
            ) : (
                <div className="messages-list">

                    {messages.map(message => (

                        <MessageItem
                            key={message.id}
                            message={message}
                            isMe={
                                message.me == true
                            }
                        />
                    ))}

                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
}