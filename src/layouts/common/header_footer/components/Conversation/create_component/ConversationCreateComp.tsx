import { useState } from 'react';
import ConversationCreateItemComp from './ConversationCreateItemComp.tsx';
import type { UserBioResponse } from '../../../../../../models/response/user/UserBioResponse.ts';
import type { ConversationType } from '../../../../../../models/enum/common.ts';
import type { ConversationResponse } from '../../../../../../models/response/conversation/ConversationResponse.ts';
import type { ConversationGroupRequest } from '../../../../../../models/request/ConversationGroupRequest.ts';
import { createDirectConversation, createGroupConversation } from '../../../../../../apis/ConversationApi.ts';
import { handleApiError } from '../../../../../../utils/errorHandler.ts';
import SearchBarComp from '../common_component/SearchBarComp.tsx';


interface ConversationCreateCompProps {
    onClose: () => void;
    onConversationCreated: () => void;
}

export default function ConversationCreateComp({ onClose, onConversationCreated }: ConversationCreateCompProps) {
    const [searchResults, setSearchResults] = useState<UserBioResponse[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserBioResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showMultiSelect, setShowMultiSelect] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    const handleSearch = (results: UserBioResponse[] | ConversationResponse[]) => {
        setSearchResults(results as UserBioResponse[]);
        // Don't reset selected users when searching for new users
        // This allows users to select multiple people across different searches
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setGroupAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateGroupConversation = async () => {
        if (selectedUsers.length < 2 || !groupName.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            const groupData: ConversationGroupRequest = {
                type: 'GROUP' as ConversationType,
                participantIds: selectedUsers.map((u) => u.id),
                groupName: groupName.trim(),
            };

            await createGroupConversation(groupAvatar, groupData);

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
        setShowMultiSelect(!showMultiSelect);
    };

    return (
        <div className="create-conversation-container">
            {/* Search Bar */}
            <div className="create-conversation-search">
                <SearchBarComp onSearch={handleSearch} isLoading={isLoading} searchType="users" />
            </div>

            {/* Search Results List */}
            <div className="create-conversation-results">
                {/* Show selected users first (always visible when in multi-select mode) */}
                {showMultiSelect && selectedUsers.length > 0 && (
                    <>
                        <div className="px-3 py-2 bg-light border-bottom">
                            <small className="text-muted fw-bold">Đã chọn ({selectedUsers.length})</small>
                        </div>
                        {selectedUsers.map((user) => (
                            <ConversationCreateItemComp
                                key={`selected-${user.id}`}
                                user={user}
                                isSelected={true}
                                isOnline={Math.random() > 0.5}
                                showCheckbox={showMultiSelect}
                                onSelect={(selected) => handleUserSelect(user, selected)}
                                onClick={() => {
                                    if (!showMultiSelect) {
                                        handleCreateDirectConversation(user);
                                    }
                                }}
                            />
                        ))}
                    </>
                )}

                {/* Show search results */}
                {searchResults.length === 0 && (!showMultiSelect || selectedUsers.length === 0) ? (
                    <div className="create-conversation-empty">
                        <i className="fa fa-search"></i>
                        <p>Tìm kiếm người dùng để bắt đầu cuộc hội thoại</p>
                    </div>
                ) : searchResults.length > 0 && (
                    <>
                        {showMultiSelect && selectedUsers.length > 0 && (
                            <div className="px-3 py-2 bg-light border-bottom">
                                <small className="text-muted fw-bold">Kết quả tìm kiếm</small>
                            </div>
                        )}
                        {searchResults
                            .filter(user => !selectedUsers.some(selected => selected.id === user.id))
                            .map((user) => (
                                <ConversationCreateItemComp
                                    key={`search-${user.id}`}
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
                            ))}
                    </>
                )}
            </div>

            {/* Controls Section - All at the bottom */}
            {(searchResults.length > 0 || selectedUsers.length > 0) && (
                <div className="create-conversation-controls">
                    {/* Toggle Multi-Select Button */}
                    <button
                        className={`create-conversation-toggle ${showMultiSelect ? 'active' : ''}`}
                        onClick={toggleMultiSelect}
                        disabled={isLoading}
                    >
                        {showMultiSelect ? '✓ Đang chọn nhiều người' : 'Chọn nhiều người'}
                    </button>

                    {/* Group Details Section */}
                    {showMultiSelect && selectedUsers.length >= 2 && (
                        <div className="create-group-details">
                            {/* Group Name Input */}
                            <div className="mb-3">
                                <label className="form-label small text-muted">Tên nhóm *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên nhóm..."
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Avatar Upload */}
                            <div className="mb-3">
                                <label className="form-label small text-muted">Avatar nhóm (tùy chọn)</label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="position-relative">
                                        <img
                                            src={avatarPreview || '/images/myAvatar.jpg'}
                                            alt="Group avatar"
                                            className="rounded-circle"
                                            width="80"
                                            height="80"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <label
                                            htmlFor="group-avatar-upload"
                                            className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: '28px', height: '28px', cursor: 'pointer' }}
                                        >
                                            <i className="fa fa-camera fa-xs"></i>
                                        </label>
                                        <input
                                            id="group-avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="d-none"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <small className="text-muted">
                                        Click camera icon để upload avatar
                                    </small>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {showMultiSelect && selectedUsers.length > 0 && (
                        <div className="create-conversation-actions">
                            <button
                                className="create-conversation-btn create-conversation-btn-primary"
                                onClick={handleCreateGroupConversation}
                                disabled={isLoading || selectedUsers.length < 2 || !groupName.trim()}
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