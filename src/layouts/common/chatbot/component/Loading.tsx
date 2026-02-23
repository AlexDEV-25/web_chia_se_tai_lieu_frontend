
const Loading: React.FC = () => {
    return (
        <div className="chatbot-message bot">
            <div className="message-content loading">
                <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default Loading;
