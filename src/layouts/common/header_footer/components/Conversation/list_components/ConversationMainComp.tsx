import { useContext, useState } from 'react';
import ConversationItemComp from './ConversationItemComp.tsx';
import type { ConversationResponse } from '../../../../../../models/response/conversation/ConversationResponse.ts';
import type { UserBioResponse } from '../../../../../../models/response/user/UserBioResponse.ts';
import SearchBarComp from '../common_component/SearchBarComp.tsx';
import { AppContext } from '../../../../../../AppContext.tsx';

interface ConversationMainCompProps {
    myConversations: ConversationResponse[];
    isLoadingMyConversations: boolean;
}

export default function ConversationMainComp({
    myConversations,
    isLoadingMyConversations,
}: ConversationMainCompProps) {
    const context = useContext(AppContext) as any;
    const [searchResults, setSearchResults] = useState<ConversationResponse[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleConversationClick = (conversationId: number) => {
        if (conversationId) {
            context.setConversationId(conversationId);
        }
    };


    const handleSearch = (results: UserBioResponse[] | ConversationResponse[]) => {
        setSearchResults(results as ConversationResponse[]);
        setIsSearching(false);
    };

    return (
        <>
            {/* Search Bar */}
            <div className="p-3 border-bottom">
                <SearchBarComp
                    onSearch={handleSearch}
                    isLoading={isSearching}
                    searchType="conversations"
                    placeholder="Tìm kiếm cuộc hội thoại..."
                />
            </div>

            {/* Conversation List */}
            <div className="conversation-list" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {/* Show search results if available */}
                {searchResults.length > 0 ? (
                    searchResults.map((conversation) => {
                        // Check if all participants are online for DIRECT conversations
                        const isAllParticipantsOnline = conversation.type === 'DIRECT' &&
                            conversation.participantInfos?.every((participant: any) => participant.userStatus === 'ONLINE');

                        return (
                            <ConversationItemComp
                                key={conversation.id}
                                name={conversation.conversationName}
                                avatarUrl={conversation.conversationAvatar || '/images/myAvatar.jpg'}
                                isSelected={false}
                                isOnline={isAllParticipantsOnline}
                                onClick={() => handleConversationClick(conversation.id)}
                            />
                        );
                    })
                ) : (
                    /* Show regular conversations when no search results */
                    <>
                        {isLoadingMyConversations ? (
                            <div className="p-4 text-center text-muted">
                                <p>Đang tải cuộc hội thoại...</p>
                            </div>
                        ) : myConversations.length === 0 ? (
                            <div className="p-4 text-center text-muted">
                                <p>Chưa có cuộc hội thoại nào. Bắt đầu một cuộc mới!</p>
                            </div>
                        ) : (
                            myConversations.map((conversation) => {
                                // Check if all participants are online for DIRECT conversations
                                const isAllParticipantsOnline = conversation.type === 'DIRECT' &&
                                    conversation.participantInfos?.every((participant: any) => participant.userStatus === 'ONLINE');

                                return (
                                    <ConversationItemComp
                                        key={conversation.id}
                                        name={conversation.conversationName}
                                        avatarUrl={conversation.conversationAvatar || '/images/myAvatar.jpg'}
                                        isSelected={false}
                                        isOnline={isAllParticipantsOnline}
                                        onClick={() => handleConversationClick(conversation.id)}
                                    />
                                );
                            })
                        )}
                    </>
                )}
            </div>
        </>
    );
}
