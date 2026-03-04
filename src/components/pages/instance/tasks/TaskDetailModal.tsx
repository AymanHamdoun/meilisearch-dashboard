import React from 'react';
import { _api_task_object } from "../../../../services/meilisearch/types";
import { BaseModal } from "../../../commons/modal/ModalComponents";
import { TaskStatusBadge } from "./Widgets";
import { DateTime, Duration } from 'luxon';

interface TaskDetailModalProps {
    isVisible: boolean;
    onClose: () => void;
    task: _api_task_object | null;
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss');
};

const formatDuration = (duration: string | null) => {
    if (!duration) return '-';
    const durationObj = Duration.fromISO(duration);
    const totalMs = durationObj.as('milliseconds');
    if (totalMs < 1000) return `${Math.round(totalMs)} ms`;
    return `${(totalMs / 1000).toFixed(3)} s`;
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isVisible, onClose, task }) => {
    if (!task) return null;

    return (
        <BaseModal
            isVisible={isVisible}
            onClose={onClose}
            title={`Task #${task.uid}`}
            width="lg"
        >
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-semibold text-gray-600">Status:</span>
                        <span className="ml-2"><TaskStatusBadge rounded={true} status={task.status} label={task.status} /></span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Type:</span>
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded">{task.type}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Index:</span>
                        <span className="ml-2 text-gray-700">{task.indexUid || '-'}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Duration:</span>
                        <span className="ml-2 text-gray-700">{formatDuration(task.duration)}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Enqueued:</span>
                        <span className="ml-2 text-gray-700">{formatDate(task.enqueuedAt)}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Started:</span>
                        <span className="ml-2 text-gray-700">{formatDate(task.startedAt)}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Finished:</span>
                        <span className="ml-2 text-gray-700">{formatDate(task.finishedAt)}</span>
                    </div>
                    {task.canceledBy !== null && task.canceledBy !== undefined && (
                        <div>
                            <span className="font-semibold text-gray-600">Canceled by:</span>
                            <span className="ml-2 text-gray-700">Task #{task.canceledBy}</span>
                        </div>
                    )}
                </div>

                {task.details && (
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <span className="font-semibold text-sm text-gray-600">Details:</span>
                        <pre className="mt-2 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
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
        </BaseModal>
    );
};

export default TaskDetailModal;
