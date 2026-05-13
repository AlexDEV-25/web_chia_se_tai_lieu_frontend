type Props = {
    avatar: string;
    name: string;
    isMinimized: boolean;
    onClose: () => void;
    onMinimize: () => void;
};

export default function ChatHeader({
    avatar,
    name,
    isMinimized,
    onClose,
    onMinimize
}: Props) {

    return (
        <div className="chat-popup-header">

            <div className="chat-header-container">

                <div className="chat-header-left">

                    <img
                        src={avatar || "/images/myAvatar.jpg"}
                        className="chat-header-avatar"
                    />

                    <span className="chat-header-name">
                        {name}
                    </span>
                </div>

                <div className="chat-header-actions">

                    <button
                        className="chat-btn"
                        onClick={onMinimize}
                    >
                        <i
                            className={`fa ${isMinimized
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                                }`}
                        />
                    </button>

                    <button
                        className="chat-btn"
                        onClick={onClose}
                    >
                        <i className="fa fa-times" />
                    </button>

                </div>
            </div>
        </div>
    );
}