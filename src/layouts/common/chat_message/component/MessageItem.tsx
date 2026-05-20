import type { ChatMessageResponse } from "../../../../models/response/chatmessage/ChatMessageResponse";


type Props = {
    message: ChatMessageResponse;
    isMe: boolean;
};

export default function MessageItem({ message, isMe }: Props) {

    return (
        <div className={`message-item ${isMe ? "message-sent" : "message-received"}`}>

            <div className="message-content">

                {!isMe && (
                    <div className="message-avatar">

                        <img
                            src={
                                message.userAvatar ||
                                "/images/myAvatar.jpg"
                            }
                        />
                    </div>
                )}

                <div className="message-bubble">

                    {!isMe && (
                        <div className="message-sender">
                            {message.userName}
                        </div>
                    )}

                    <div className="message-text">
                        {message.message}
                    </div>

                    <div className="message-time">
                        {
                            new Date(
                                message.createdAt
                            ).toLocaleTimeString(
                                "vi-VN", { hour: "2-digit", minute: "2-digit" }
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    );
}