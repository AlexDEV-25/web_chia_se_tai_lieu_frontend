import { useState, useEffect, useContext } from 'react';
import type { ChatMessageResponse } from '../../../models/response/chatmessage/ChatMessageResponse';
import { getMyMessages } from '../../../apis/ChatMessageApi';
import { handleApiError } from '../../../utils/errorHandler';
import { AppContext } from '../../../AppContext';

export default function ChatMessage() {
    const context = useContext(AppContext) as any;

    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (context.conversationId) {
            loadMessages();
        }
    }, [context.conversationId]);

    const loadMessages = async () => {
        setIsLoading(true);

        try {
            const response = await getMyMessages(context.conversationId);
            setMessages(response.resultList || []);
        } catch (error: any) {
            const message = handleApiError(error, 'Không thể tải tin nhắn');
            console.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        context.setConversationId(null);
        context.setConversationName(null);
    };

    const onMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const shortConversationName =
        context.conversationName?.length > 10
            ? context.conversationName.slice(0, 10) + '...'
            : context.conversationName;

    return (
        <div className={`chat-popup ${isMinimized ? 'chat-popup-minimized' : ''}`}>
            {/* HEADER */}
            <div
                className="chat-popup-header"
                onClick={isMinimized ? onMinimize : undefined}
            >
                <div className="chat-header-container">
                    <div className="chat-header-left">
                        <img
                            src={context.conversationAvatar || '/images/myAvatar.jpg'}
                            alt={context.conversationName}
                            className="chat-header-avatar"
                        />

                        <span className="chat-header-name">
                            {shortConversationName}
                        </span>
                    </div>

                    <div className="chat-header-actions">
                        <button
                            className="chat-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMinimize();
                            }}
                        >
                            <i
                                className={`fa ${isMinimized
                                    ? 'fa-chevron-up'
                                    : 'fa-chevron-down'
                                    }`}
                            ></i>
                        </button>

                        <button
                            className="chat-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            <i className="fa fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* MESSAGES */}
            <div className="chat-popup-messages">
                {isLoading ? (
                    <div className="chat-loading">
                        <i className="fa fa-spinner fa-spin"></i>
                        <span>Đang tải tin nhắn...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="chat-empty">
                        Chưa có tin nhắn nào
                    </div>
                ) : (
                    <div className="messages-list">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-item ${message.me
                                    ? 'message-sent'
                                    : 'message-received'
                                    }`}
                            >
                                <div className="message-content">
                                    {!message.me && (
                                        <div className="message-avatar">
                                            <img
                                                src={
                                                    message.userAvatar ||
                                                    '/images/myAvatar.jpg'
                                                }
                                                alt={message.userName}
                                            />
                                        </div>
                                    )}

                                    <div className="message-bubble">
                                        <div className="message-text">
                                            {message.message}
                                        </div>

                                        <div className="message-time">
                                            {new Date(
                                                message.createdAt
                                            ).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* INPUT */}
            <div className="chat-popup-input">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tin nhắn..."
                        disabled
                    />

                    <button className="send-btn" disabled>
                        <i className="fa fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}