import React from 'react';

interface SearchPaginationProps {
    offset: number;
    limit: number;
    totalHits?: number;
    estimatedTotalHits?: number;
    onOffsetChange: (offset: number) => void;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({
    offset,
    limit,
    totalHits,
    estimatedTotalHits,
    onOffsetChange,
}) => {
    const total = totalHits || estimatedTotalHits || 0;
    if (total === 0) return null;

    const startItem = offset + 1;
    const endItem = Math.min(offset + limit, total);
    const isEstimated = !totalHits && !!estimatedTotalHits;

    return (
        <div className="flex justify-between items-center py-2">
            <div className="text-sm text-gray-500">
                Showing {startItem}–{endItem} of {isEstimated ? '~' : ''}{total}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onOffsetChange(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onOffsetChange(offset + limit)}
                    disabled={endItem >= total}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SearchPagination;
