import React from 'react';
import PropTypes from 'prop-types';

const availableFilters = {
    types: [
        { value: "indexCreation", label: "Index Creation" },
        { value: "indexUpdate", label: "Index Update" },
        { value: "indexDeletion", label: "Index Deletion" },
        { value: "indexSwap", label: "Index Swap" },
        { value: "documentAdditionOrUpdate", label: "Document Addition/Update" },
        { value: "documentDeletion", label: "Document Deletion" },
        { value: "documentDeletionByFilter", label: "Document Deletion by Filter" },
        { value: "documentEdition", label: "Document Edition" },
        { value: "settingsUpdate", label: "Settings Update" },
        { value: "dumpCreation", label: "Dump Creation" },
        { value: "snapshotCreation", label: "Snapshot Creation" },
        { value: "taskCancelation", label: "Task Cancelation" },
        { value: "taskDeletion", label: "Task Deletion" },
        { value: "upgradeDatabase", label: "Upgrade Database" },
        { value: "export", label: "Export" },
        { value: "indexCompaction", label: "Index Compaction" }
    ],
    statuses: [
        { value: "enqueued", label: "Enqueued" },
        { value: "processing", label: "Processing" },
        { value: "succeeded", label: "Succeeded" },
        { value: "failed", label: "Failed" },
        { value: "canceled", label: "Canceled" }
    ]
};

interface TaskFiltersProps {
    selectedStatus: string;
    selectedType: string;
    onFilterChange: (filterType: 'statuses' | 'types', value: string) => void;
    afterEnqueuedAt?: string;
    beforeEnqueuedAt?: string;
    onDateFilterChange?: (field: string, value: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
    selectedStatus,
    selectedType,
    onFilterChange,
    afterEnqueuedAt,
    beforeEnqueuedAt,
    onDateFilterChange
}) => {
    return (
        <div className="flex gap-2 flex-wrap">
            <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => onFilterChange('statuses', e.target.value)}
                aria-label="Filter tasks by status"
            >
                <option value="">All Statuses</option>
                {availableFilters.statuses.map(status => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>

            <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedType}
                onChange={(e) => onFilterChange('types', e.target.value)}
                aria-label="Filter tasks by type"
            >
                <option value="">All Types</option>
                {availableFilters.types.map(type => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>

            {onDateFilterChange && (
                <>
                    <input
                        type="datetime-local"
                        value={afterEnqueuedAt || ''}
                        onChange={(e) => onDateFilterChange('afterEnqueuedAt', e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        title="After enqueued at"
                        placeholder="After date"
                    />
                    <input
                        type="datetime-local"
                        value={beforeEnqueuedAt || ''}
                        onChange={(e) => onDateFilterChange('beforeEnqueuedAt', e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        title="Before enqueued at"
                        placeholder="Before date"
                    />
                </>
            )}
        </div>
    );
};

TaskFilters.propTypes = {
    selectedStatus: PropTypes.string.isRequired,
    selectedType: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired
};

export default TaskFilters;