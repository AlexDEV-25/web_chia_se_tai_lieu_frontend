import { useState, useEffect, useRef } from 'react';

import ConversationMainComp from './list_components/ConversationMainComp.tsx';
import type { ConversationResponse } from '../../../../../models/response/conversation/ConversationResponse.ts';
import { getMyConversation } from '../../../../../apis/ConversationApi.ts';
import ConversationCreateComp from './create_component/ConversationCreateComp.tsx';

export default function ListConversation() {
    const [isOpen, setIsOpen] = useState(false);
    const [myConversations, setMyConversations] = useState<ConversationResponse[]>([]);
    const [isLoadingMyConversations, setIsLoadingMyConversations] = useState(true);
    const [showCreateConversation, setShowCreateConversation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load my conversations on mount
    useEffect(() => {
        loadMyConversations();
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadMyConversations();
        }
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowCreateConversation(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const loadMyConversations = async () => {
        setIsLoadingMyConversations(true);
        try {
            const response = await getMyConversation();
            const conversationList = response.resultList || [];
            setMyConversations(conversationList);
        } catch (error: any) {
            console.error('Không thể tải danh sách cuộc hội thoại:', error);
        } finally {
            setIsLoadingMyConversations(false);
        }
    };

    const handleConversationCreated = () => {
        loadMyConversations();
        setShowCreateConversation(false);
    };

    const handleConversationClick = (conversationId: number) => {
        console.log('Clicked conversation:', conversationId);
        setIsOpen(false);
    };

    return (
        <div className="conversation-wrapper">
            {/* Conversation Bell */}
            <button
                className="conversation-bell"
                onClick={() => setIsOpen(!isOpen)}
                title="Tin nhắn"
            >
                <i className="fa fa-comments" />
            </button>

            {/* Conversation Dropdown */}
            {isOpen && (
                <div className="conversation-dropdown" ref={dropdownRef}>
                    <div className="list-conversation-container">
                        {/* Header */}
                        <div className="conversation-header d-flex justify-content-between align-items-center p-3 border-bottom">
                            <h5 className="mb-0 fw-bold">
                                {showCreateConversation ? 'Tạo cuộc hội thoại mới' : 'Tin nhắn'}
                            </h5>
                            <button
                                className="btn btn-primary btn-sm rounded-circle"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => setShowCreateConversation(!showCreateConversation)}
                                title={showCreateConversation ? 'Quay lại' : 'Tạo cuộc hội thoại mới'}
                            >
                                {showCreateConversation ? '←' : '+'}
                            </button>
                        </div>

                        {/* Content: ConversationMainComp or ConversationCreateComp */}
                        {showCreateConversation ? (
                            <ConversationCreateComp
                                onClose={() => setShowCreateConversation(false)}
                                onConversationCreated={handleConversationCreated}
                            />
                        ) : (
                            <ConversationMainComp
                                myConversations={myConversations}
                                isLoadingMyConversations={isLoadingMyConversations}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                onConversationClick={handleConversationClick}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
