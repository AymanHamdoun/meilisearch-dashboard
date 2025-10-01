import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DateTime, Duration } from 'luxon';
import { _api_task_object } from "../../../../services/meilisearch/types";
import { TaskStatusBadge } from "./Widgets";
import TasksTableSkeleton from "./TasksTableSkeleton";

interface TasksTableProps {
    tasks: _api_task_object[];
    isLoading: boolean;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, isLoading }) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRowExpand = (taskUid: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(taskUid)) {
            newExpanded.delete(taskUid);
        } else {
            newExpanded.add(taskUid);
        }
        setExpandedRows(newExpanded);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss');
    };

    const formatDuration = (duration: string | null) => {
        if (!duration) return '-';
        const durationObj = Duration.fromISO(duration);
        const totalMs = durationObj.as('milliseconds');

        if (totalMs < 1000) {
            return `${Math.round(totalMs)} ms`;
        } else {
            return `${(totalMs / 1000).toFixed(3)} s`;
        }
    };

    if (isLoading) {
        return <TasksTableSkeleton />;
    }

    if (tasks.length === 0) {
        return (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow" role="status" aria-live="polite">
                <div className="text-gray-500">No tasks found</div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Tasks table">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Task
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Index
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enqueued At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                        <React.Fragment key={task.uid}>
                            <TaskRow
                                task={task}
                                isExpanded={expandedRows.has(task.uid)}
                                onToggleExpand={() => toggleRowExpand(task.uid)}
                                formatDate={formatDate}
                                formatDuration={formatDuration}
                            />
                            {expandedRows.has(task.uid) && (
                                <TaskDetails
                                    task={task}
                                    formatDate={formatDate}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface TaskRowProps {
    task: _api_task_object;
    isExpanded: boolean;
    onToggleExpand: () => void;
    formatDate: (date: string | null) => string;
    formatDuration: (duration: string | null) => string;
}

const TaskRow: React.FC<TaskRowProps> = ({
    task,
    isExpanded,
    onToggleExpand,
    formatDate,
    formatDuration
}) => {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{task.uid}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.indexUid || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {task.type}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <TaskStatusBadge rounded={true} status={task.status} label={task.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(task.enqueuedAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDuration(task.duration)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                    className="text-primary hover:text-primary-dark mr-3"
                    onClick={onToggleExpand}
                    aria-expanded={isExpanded}
                    aria-label={`View details for task #${task.uid}`}
                >
                    {isExpanded ? 'Hide' : 'Details'}
                </button>
            </td>
        </tr>
    );
};

interface TaskDetailsProps {
    task: _api_task_object;
    formatDate: (date: string | null) => string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, formatDate }) => {
    return (
        <tr>
            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">Started at:</span>
                            <span className="ml-2 text-gray-600">{formatDate(task.startedAt)}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Finished at:</span>
                            <span className="ml-2 text-gray-600">{formatDate(task.finishedAt)}</span>
                        </div>
                    </div>

                    {task.details && (
                        <div className="bg-white p-3 rounded border border-gray-200">
                            <span className="font-semibold text-sm">Details:</span>
                            <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                                {JSON.stringify(task.details, null, 2)}
                            </pre>
                        </div>
                    )}

                    {task.error && (
                        <div className="bg-red-50 p-3 rounded border border-red-200">
                            <span className="font-semibold text-sm text-red-700">Error:</span>
                            <p className="mt-1 text-sm text-red-600">{task.error.message}</p>
                            {task.error.code && (
                                <p className="mt-1 text-xs text-red-500">Code: {task.error.code}</p>
                            )}
                            {task.error.type && (
                                <p className="text-xs text-red-500">Type: {task.error.type}</p>
                            )}
                            {task.error.link && (
                                <a href={task.error.link} target="_blank" rel="noopener noreferrer"
                                   className="text-xs text-red-600 underline hover:text-red-700">
                                    More info
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

TasksTable.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape({
        uid: PropTypes.number.isRequired,
        indexUid: PropTypes.string,
        status: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        enqueuedAt: PropTypes.string,
        startedAt: PropTypes.string,
        finishedAt: PropTypes.string,
        duration: PropTypes.string,
        details: PropTypes.object,
        error: PropTypes.shape({
            message: PropTypes.string,
            code: PropTypes.string,
            type: PropTypes.string,
            link: PropTypes.string
        })
    })).isRequired,
    isLoading: PropTypes.bool.isRequired
};

export default React.memo(TasksTable);