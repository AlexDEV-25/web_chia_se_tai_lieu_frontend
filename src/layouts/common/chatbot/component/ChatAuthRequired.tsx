import { Link } from "react-router-dom";

interface Props {
    onMinimize: () => void;
}

const ChatAuthRequired: React.FC<Props> = ({ onMinimize }) => {
    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div className="chatbot-title">
                    <i className="fa fa-robot" />
                    <span>AI Assistant</span>
                </div>
                <button
                    onClick={onMinimize}
                    className="chatbot-minimize-btn"
                >
                    <i className="fa fa-minus" />
                </button>
            </div>

            <div className="chatbot-messages">
                <div className="chatbot-auth-required">
                    <i className="fa fa-lock" />
                    <h3>Yêu cầu đăng nhập</h3>
                    <p>Bạn phải đăng nhập để sử dụng tính năng này.</p>
                    <Link to="/login" className="login-btn">
                        <i className="fa fa-sign-in" />
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChatAuthRequired;
