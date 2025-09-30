import React from 'react';

const availableFilters = {
    types: [
        { value: "indexCreation", label: "Index Creation" },
        { value: "indexUpdate", label: "Index Update" },
        { value: "indexDeletion", label: "Index Deletion" },
        { value: "indexSwap", label: "Index Swap" },
        { value: "documentAdditionOrUpdate", label: "Document Addition/Update" },
        { value: "documentDeletion", label: "Document Deletion" },
        { value: "settingsUpdate", label: "Settings Update" },
        { value: "dumpCreation", label: "Dump Creation" },
        { value: "taskCancelation", label: "Task Cancelation" },
        { value: "taskDeletion", label: "Task Deletion" }
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
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
    selectedStatus,
    selectedType,
    onFilterChange
}) => {
    return (
        <div className="flex gap-2">
            <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => onFilterChange('statuses', e.target.value)}
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
            >
                <option value="">All Types</option>
                {availableFilters.types.map(type => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TaskFilters;