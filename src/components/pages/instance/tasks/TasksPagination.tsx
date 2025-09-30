import React from 'react';

interface TasksPaginationProps {
    startItem: number;
    endItem: number;
    total: number;
    currentPage: number;
    canGoNext: boolean;
    canGoPrev: boolean;
    onNext: () => void;
    onPrev: () => void;
}

const TasksPagination: React.FC<TasksPaginationProps> = ({
    startItem,
    endItem,
    total,
    currentPage,
    canGoNext,
    canGoPrev,
    onNext,
    onPrev
}) => {
    return (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
            <span className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span>{' '}
                of <span className="font-medium">{total}</span> results
                {currentPage > 1 && <span className="ml-2">(Page {currentPage})</span>}
            </span>

            <div className="flex gap-2">
                <button
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onPrev}
                    disabled={!canGoPrev}
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onNext}
                    disabled={!canGoNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TasksPagination;