import { useState } from 'react';
import ConversationCreateItemComp from './ConversationCreateItemComp.tsx';
import type { UserBioResponse } from '../../../../../../models/response/user/UserBioResponse.ts';
import type { ConversationType } from '../../../../../../models/enum/common.ts';
import { createDirectConversation, createGroupConversation } from '../../../../../../apis/ConversationApi.ts';
import { handleApiError } from '../../../../../../utils/errorHandler.ts';
import SearchBarCreateComp from './SearchBarCreateComp.tsx';


interface ConversationCreateCompProps {
    onClose: () => void;
    onConversationCreated: () => void;
}

export default function ConversationCreateComp({ onClose, onConversationCreated }: ConversationCreateCompProps) {
    const [searchResults, setSearchResults] = useState<UserBioResponse[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserBioResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showMultiSelect, setShowMultiSelect] = useState(false);

    const handleSearch = (results: UserBioResponse[]) => {
        setSearchResults(results);
        setSelectedUsers([]);
        setShowMultiSelect(false);
    };

    const handleUserSelect = (user: UserBioResponse, isSelected: boolean) => {
        if (isSelected) {
            setSelectedUsers([...selectedUsers, user]);
        } else {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
        }
    };

    const isUserSelected = (userId: number): boolean => {
        return selectedUsers.some((u) => u.id === userId);
    };

    const handleCreateDirectConversation = async (user: UserBioResponse) => {
        setIsLoading(true);
        try {
            await createDirectConversation({
                type: 'DIRECT' as ConversationType,
                participantIds: [user.id],
            });

            onClose();
            onConversationCreated();
        } catch (error: any) {
            const message = handleApiError(error, 'Lỗi khi tạo cuộc hội thoại');
            console.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateGroupConversation = async () => {
        if (selectedUsers.length < 2) {
            return;
        }

        setIsLoading(true);
        try {
            await createGroupConversation({
                type: 'GROUP' as ConversationType,
                participantIds: selectedUsers.map((u) => u.id),
            });

            onClose();
            onConversationCreated();
        } catch (error: any) {
            const message = handleApiError(error, 'Lỗi khi tạo nhóm hội thoại');
            console.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMultiSelect = () => {
        if (!showMultiSelect) {
            setSelectedUsers([]);
        }
        setShowMultiSelect(!showMultiSelect);
    };

    return (
        <div className="create-conversation-container">
            {/* Search Bar */}
            <div className="create-conversation-search">
                <SearchBarCreateComp onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Search Results List */}
            <div className="create-conversation-results">
                {searchResults.length === 0 ? (
                    <div className="create-conversation-empty">
                        <i className="fa fa-search"></i>
                        <p>Tìm kiếm người dùng để bắt đầu cuộc hội thoại</p>
                    </div>
                ) : (
                    searchResults.map((user) => (
                        <ConversationCreateItemComp
                            key={user.id}
                            user={user}
                            isSelected={isUserSelected(user.id)}
                            isOnline={Math.random() > 0.5}
                            showCheckbox={showMultiSelect}
                            onSelect={(selected) => handleUserSelect(user, selected)}
                            onClick={() => {
                                if (!showMultiSelect) {
                                    handleCreateDirectConversation(user);
                                }
                            }}
                        />
                    ))
                )}
            </div>

            {/* Controls Section - All at the bottom */}
            {searchResults.length > 0 && (
                <div className="create-conversation-controls">
                    {/* Toggle Multi-Select Button */}
                    <button
                        className={`create-conversation-toggle ${showMultiSelect ? 'active' : ''}`}
                        onClick={toggleMultiSelect}
                        disabled={isLoading}
                    >
                        {showMultiSelect ? '✓ Đang chọn nhiều người' : 'Chọn nhiều người'}
                    </button>

                    {/* Selected Count Badge */}
                    {showMultiSelect && selectedUsers.length > 0 && (
                        <div className="create-conversation-count">
                            <span className="create-conversation-badge">
                                {selectedUsers.length} người được chọn
                            </span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {showMultiSelect && selectedUsers.length > 0 && (
                        <div className="create-conversation-actions">
                            <button
                                className="create-conversation-btn create-conversation-btn-primary"
                                onClick={handleCreateGroupConversation}
                                disabled={isLoading || selectedUsers.length < 2}
                            >
                                Tạo nhóm ({selectedUsers.length})
                            </button>
                            <button
                                className="create-conversation-btn create-conversation-btn-secondary"
                                onClick={() => setSelectedUsers([])}
                                disabled={isLoading}
                            >
                                Xóa lựa chọn
                            </button>
                        </div>
                    )}

                    {/* Help Text - At the bottom */}
                    {!showMultiSelect && (
                        <div className="create-conversation-help">
                            <i className="fa fa-info-circle"></i>
                            <span>Click vào người dùng để tạo cuộc hội thoại</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}