import React from 'react';

interface PaginationControlsProps {
    offset: number;
    limit: number;
    total: number;
    onPrevPage: () => void;
    onNextPage: () => void;
}

const PagePaginationControls: React.FC<PaginationControlsProps> = ({
    offset,
    limit,
    total,
    onPrevPage,
    onNextPage
}) => {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    if (totalPages <= 1) {
        return null;
    }

    const startItem = offset + 1;
    const endItem = Math.min(offset + limit, total);

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Showing {startItem} to {endItem} of {total} results
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onPrevPage}
                    disabled={offset === 0}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={onNextPage}
                    disabled={offset + limit >= total}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PagePaginationControls;