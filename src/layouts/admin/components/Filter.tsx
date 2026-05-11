import React from 'react';
import type { VisibilityFilter } from '../../../models/enum/common';



interface FilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterValue: VisibilityFilter;
    onFilterChange: (filter: VisibilityFilter) => void;
    placeholder?: string;
    containerClass?: string;
    searchClass?: string;
    filterActionsClass?: string;
    filterChipClass?: string;
}

const Filter: React.FC<FilterProps> = ({
    searchTerm,
    onSearchChange,
    filterValue,
    onFilterChange,
    placeholder = 'Tìm kiếm theo tên hoặc mô tả…',
    containerClass = 'filters',
    searchClass = 'search',
    filterActionsClass = 'filter-actions',
    filterChipClass = 'filter-chip'
}) => {
    const filters: VisibilityFilter[] = ['ALL', 'VISIBLE', 'HIDDEN'];
    const filterLabels: Record<VisibilityFilter, string> = {
        ALL: 'Tất cả',
        VISIBLE: 'Hiển thị',
        HIDDEN: 'Ẩn'
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

            </div>
        </div>
    );
};

export default Filter;
