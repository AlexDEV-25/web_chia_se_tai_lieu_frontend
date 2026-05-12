import { useState } from 'react';
import { searchUsers } from '../../../../../../apis/UserApi.ts';
import { searchConversations } from '../../../../../../apis/ConversationApi.ts';
import type { UserBioResponse } from '../../../../../../models/response/user/UserBioResponse.ts';
import type { ConversationResponse } from '../../../../../../models/response/conversation/ConversationResponse.ts';
import { handleApiError } from '../../../../../../utils/errorHandler.ts';

type SearchType = 'users' | 'conversations';

interface SearchBarCompProps {
    onSearch: (results: UserBioResponse[] | ConversationResponse[]) => void;
    isLoading: boolean;
    searchType: SearchType;
    placeholder?: string;
}

export default function SearchBarComp({ onSearch, isLoading, searchType, placeholder }: SearchBarCompProps) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            onSearch([]);
            return;
        }

        setIsSearching(true);
        try {
            let response;
            let results;

            if (searchType === 'users') {
                response = await searchUsers(searchKeyword);
                results = response.resultList || [];
            } else {
                response = await searchConversations(searchKeyword);
                results = response.resultList || [];
            }

            onSearch(results);
        } catch (error: any) {
            const errorMessage = searchType === 'users'
                ? 'Không thể tìm kiếm người dùng'
                : 'Không thể tìm kiếm cuộc hội thoại';
            const message = handleApiError(error, errorMessage);
            console.error(message);
            onSearch([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClear = () => {
        setSearchKeyword('');
        onSearch([]);
    };

    return (
        <div className="create-search-wrapper">
            <div className="create-search-input-group">
                <i className="fa fa-search create-search-icon"></i>
                <input
                    type="text"
                    className="create-search-input"
                    placeholder={placeholder || (searchType === 'users' ? 'Tìm kiếm người dùng...' : 'Tìm kiếm cuộc hội thoại...')}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || isSearching}
                />
                {searchKeyword && (
                    <button
                        className="create-search-clear"
                        onClick={handleClear}
                        disabled={isLoading || isSearching}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                )}
            </div>
            {isSearching && (
                <div className="create-search-loading">
                    <i className="fa fa-spinner fa-spin"></i>
                    <span>Đang tìm kiếm...</span>
                </div>
            )}
        </div>
    );
}
