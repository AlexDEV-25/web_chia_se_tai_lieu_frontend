import React from 'react';

type FilterType = 'all' | 'visible' | 'hidden';

interface FilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterValue: FilterType;
    onFilterChange: (filter: FilterType) => void;
    onRefresh: () => void;
    placeholder?: string;
    containerClass?: string;
    searchClass?: string;
    filterActionsClass?: string;
    filterChipClass?: string;
    buttonClass?: string;
}

const Filter: React.FC<FilterProps> = ({
    searchTerm,
    onSearchChange,
    filterValue,
    onFilterChange,
    onRefresh,
    placeholder = 'Tìm kiếm theo tên hoặc mô tả…',
    containerClass = 'filters',
    searchClass = 'search',
    filterActionsClass = 'filter-actions',
    filterChipClass = 'filter-chip',
    buttonClass = 'btn ghost'
}) => {
    const filters: FilterType[] = ['all', 'visible', 'hidden'];
    const filterLabels: Record<FilterType, string> = {
        all: 'Tất cả',
        visible: 'Hiển thị',
        hidden: 'Ẩn'
    };

    return (
        <div className={containerClass}>
            <div className={searchClass}>
                <i className="fa fa-search" aria-hidden="true" />
                <input
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                />
            </div>
            <div className={filterActionsClass}>
                <div className="filter-group">
                    <label>Trạng thái:</label>
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => onFilterChange(filter)}
                            className={`${filterChipClass} ${filterValue === filter ? 'is-active' : ''}`}
                        >
                            {filterLabels[filter]}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={onRefresh}
                    className={buttonClass}
                >
                    Làm mới
                </button>
            </div>
        </div>
    );
};

export default Filter;
