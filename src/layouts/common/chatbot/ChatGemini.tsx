import { useState, useRef, useEffect } from "react";
import { chatbot, getAllHistoryByUser } from "../../../apis/ChatGemini";
import type { ChatHistoryResponse } from "../../../models/response/ai/ChatHistoryResponse";
import { handleApiError } from "../../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../../constants/messages";
import ChatAuthRequired from "./component/ChatAuthRequired";
import Loading from "./component/Loading";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    fileName?: string;
}

const ChatGemini: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);

    const loadChatHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await getAllHistoryByUser();
            const historyMessages = response.resultList?.map((item: ChatHistoryResponse, index: number) => ({
                id: `history-${index}`,
                text: formatMessageText(item.content),
                sender: item.role === "USER" ? "user" as const : "bot" as const,
            })) || [];
            setMessages(historyMessages);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CHAT_HISTORY_LOAD_FAILED);
            console.error(message);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadChatHistory();
            setIsMinimized(false);
        } else {
            setMessages([]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!token && messages.length > 0) {
            setMessages([]);
        }
    }, [token]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() && !selectedFile) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: "user",
            fileName: selectedFile?.name
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {

            const fileToSend = selectedFile || undefined;

            const response = await chatbot(fileToSend!, inputMessage);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: formatMessageText(response.result || "Xin lỗi, tôi không thể trả lời ngay lúc này."),
                sender: "bot",
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.CHAT_SEND_FAILED);
            console.error("Chat error:", message);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: ERROR_MESSAGES.CHAT_SEND_FAILED,
                sender: "bot",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatMessageText = (text: string) => {
        // Handle bold text (**...**)
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Handle numbered lists (1., 2., 3.) and add line breaks
        formattedText = formattedText.replace(/(\d+\.\s)/g, '\n$1');

        // Handle colons with line breaks
        formattedText = formattedText.replace(/:/g, ':\n');

        return formattedText;
    };

    if (isMinimized) {
        return (
            <div className="chatbot-minimized">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="chatbot-toggle-btn"
                >
                    <i className="fa fa-comments" />
                    <span>Alex</span>
                </button>
            </div>
        );
    }
    if (!isAuthenticated) {
        return (
            <ChatAuthRequired onMinimize={() => setIsMinimized(true)} />
        );
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div className="chatbot-title">
                    <i className="fa fa-robot" />
                    <span>AI Assistant</span>
                </div>
                <button
                    onClick={() => setIsMinimized(true)}
                    className="chatbot-minimize-btn"
                >
                    <i className="fa fa-minus" />
                </button>
            </div>

            <div className="chatbot-messages">
                {isLoadingHistory ? (
                    <div className="chatbot-welcome">
                        <i className="fa fa-spinner fa-spin" />
                        <p>Đang tải lịch sử trò chuyện...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="chatbot-welcome">
                        <i className="fa fa-robot" />
                        <p>Xin chào! Tôi là trợ lý AI. Bạn có thể hỏi tôi bất cứ điều gì và đính kèm file nếu cần.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`chatbot-message ${message.sender === "user" ? "user" : "bot"}`}
                            >
                                <div className="message-content">
                                    {message.sender === "user" && message.fileName && (
                                        <div className="attached-file">
                                            <i className="fa fa-paperclip" />
                                            <span>{message.fileName}</span>
                                        </div>
                                    )}
                                    <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {isLoading && (<Loading />)}
                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
                {selectedFile && (
                    <div className="selected-file">
                        <i className="fa fa-paperclip" />
                        <span>{selectedFile.name}</span>
                        <button onClick={removeFile} className="remove-file">
                            <i className="fa fa-times" />
                        </button>
                    </div>
                )}

                <div className="chatbot-input-container">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="file-input"
                        style={{ display: "none" }}
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="attach-file-btn"
                        title="Đính kèm file"
                    >
                        <i className="fa fa-paperclip" />
                    </button>

                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="chatbot-input"
                        disabled={isLoading}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
                        className="send-btn"
                    >
                        <i className={`fa ${isLoading ? "fa-spinner fa-spin" : "fa-paper-plane"}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatGemini;