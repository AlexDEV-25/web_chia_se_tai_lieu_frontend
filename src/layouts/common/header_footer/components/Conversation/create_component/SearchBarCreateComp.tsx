import { useState } from 'react';
import { searchUsers } from '../../../../../../apis/UserApi.ts';
import type { UserBioResponse } from '../../../../../../models/response/user/UserBioResponse.ts';
import { handleApiError } from '../../../../../../utils/errorHandler.ts';

interface SearchBarCreateCompProps {
    onSearch: (results: UserBioResponse[]) => void;
    isLoading: boolean;
}

export default function SearchBarCreateComp({ onSearch, isLoading }: SearchBarCreateCompProps) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            onSearch([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchUsers(searchKeyword);
            const results = response.resultList || [];
            onSearch(results);
        } catch (error: any) {
            const message = handleApiError(error, 'Không thể tìm kiếm người dùng');
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
                    placeholder="Tìm kiếm người dùng..."
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
