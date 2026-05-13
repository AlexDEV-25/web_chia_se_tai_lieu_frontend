import { useState } from "react";

import WebSocketService from "../../../../apis/WebSocketService";

type Props = {
    onSend: (message: string) => void;
};

export default function ChatInput({
    onSend
}: Props) {

    const [message, setMessage] =
        useState("");

    const handleSubmit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        onSend(message);

        setMessage("");
    };

    return (
        <div className="chat-popup-input">

            <form
                onSubmit={handleSubmit}
                className="input-group"
            >

                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    disabled={
                        !WebSocketService.getIsConnected()
                    }
                />

                <button
                    type="submit"
                    className="send-btn"
                >
                    <i className="fa fa-paper-plane" />
                </button>

            </form>
        </div>
    );
}