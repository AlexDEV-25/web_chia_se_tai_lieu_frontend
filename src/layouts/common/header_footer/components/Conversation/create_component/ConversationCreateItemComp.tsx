import type { UserBioResponse } from '../../../../../../models/response/user/UserBioResponse';

interface ConversationCreateItemCompProps {
    user: UserBioResponse;
    isSelected: boolean;
    isOnline?: boolean;
    onSelect?: (selected: boolean) => void;
    onClick?: () => void;
    showCheckbox?: boolean;
}

export default function ConversationCreateItemComp({
    user,
    isSelected,
    isOnline = false,
    onSelect,
    onClick,
    showCheckbox = false,
}: ConversationCreateItemCompProps) {
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onSelect?.(e.target.checked);
    };

    const handleItemClick = () => {
        if (showCheckbox && onSelect) {
            onSelect(!isSelected);
        } else {
            onClick?.();
        }
    };

    return (
        <div
            className={`create-user-item ${isSelected ? 'create-user-item-selected' : ''}`}
            onClick={handleItemClick}
        >
            {showCheckbox && (
                <div className="create-user-checkbox">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                    />
                </div>
            )}

            <div className="create-user-avatar-wrapper">
                <img
                    src={user.avatarUrl || 'https://via.placeholder.com/48'}
                    alt={user.username}
                    className="create-user-avatar"
                />
                {isOnline && <span className="create-user-online"></span>}
            </div>

            <span className="create-user-name">{user.username}</span>
        </div>
    );
}
