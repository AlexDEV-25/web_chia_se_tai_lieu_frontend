interface ConversationItemCompProps {
    isSelected?: boolean;
    isOnline?: boolean;
    onClick?: () => void;
    name: string;
    avatarUrl: string;
}

export default function ConversationItemComp({
    isSelected,
    isOnline,
    onClick,
    name,
    avatarUrl,
}: ConversationItemCompProps) {

    return (
        <div
            className={`conversation-item d-flex align-items-center p-3 border-bottom cursor-pointer 
                ${isSelected ? 'bg-light' : ''}`}
            onClick={onClick}
            style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
        >
            <div className="position-relative me-3">
                <img
                    src={avatarUrl || '/images/myAvatar.jpg'}
                    alt={name}
                    className="rounded-circle"
                    width="48"
                    height="48"
                    style={{ objectFit: 'cover' }}
                />
                {isOnline && (
                    <div
                        className="position-absolute bottom-0 end-0"
                        style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#28a745',
                            borderRadius: '50%',
                            border: '2px solid white',
                        }}
                    ></div>
                )}
            </div>

            <div className="flex-grow-1">
                <h6 className="mb-1 fw-semibold">{name}</h6>
            </div>
        </div>
    );
}