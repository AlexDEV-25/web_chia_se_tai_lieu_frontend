import ConversationItemComp from './ConversationItemComp.tsx';
import type { ConversationResponse } from '../../../../../../models/response/conversation/ConversationResponse.ts';

interface ConversationMainCompProps {
    myConversations: ConversationResponse[];
    isLoadingMyConversations: boolean;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onConversationClick: (conversationId: number) => void;
}

export default function ConversationMainComp({
    myConversations,
    isLoadingMyConversations,
    searchQuery,
    setSearchQuery,
    onConversationClick,
}: ConversationMainCompProps) {
    return (
        <>
            {/* Search Bar */}
            <div className="p-3 border-bottom">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm cuộc hội thoại..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="input-group-text">
                        <i className="fa fa-search"></i>
                    </span>
                </div>
            </div>

            {/* Conversation List */}
            <div className="conversation-list" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
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
                                avatarUrl={conversation.conversationAvatar || 'https://via.placeholder.com/56'}
                                isSelected={false}
                                isOnline={isAllParticipantsOnline}
                                onClick={() => onConversationClick(conversation.id)}
                            />
                        );
                    })
                )}
            </div>
        </>
    );
}
