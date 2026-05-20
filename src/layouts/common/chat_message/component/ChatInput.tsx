import { useState } from "react";

import WebSocketService from "../../../../apis/WebSocketService";

type Props = {
    onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: Props) {

    const [message, setMessage] = useState("");

    const handleSend = () => {

        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            return;
        }

        onSend(trimmedMessage);
        setMessage("");
    };

    return (
        <div className="chat-popup-input">

            <div className="input-group">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    disabled={
                        !WebSocketService.getIsConnected()
                    }
                />
                <button
                    type="button"
                    className="send-btn"
                    onClick={handleSend}
                >
                    <i className="fa fa-paper-plane" />
                </button>
            </div>
        </div>
    );
}