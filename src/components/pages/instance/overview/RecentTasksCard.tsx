import React from 'react';
import { Link } from 'react-router-dom';

interface TaskItem {
    uid: number;
    indexUid: string | null;
    status: string;
    type: string;
    enqueuedAt: string;
    finishedAt?: string;
    error?: { message: string; code: string };
}

interface RecentTasksCardProps {
    tasks: TaskItem[] | null;
}

const STATUS_COLORS: Record<string, string> = {
    succeeded: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    enqueued: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    canceled: 'bg-gray-100 text-gray-600',
};

const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'just now';
};

const RecentTasksCard: React.FC<RecentTasksCardProps> = ({ tasks }) => {
    return (
        <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Recent Tasks</h3>
                <Link to="/instance/tasks" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {!tasks || tasks.length === 0 ? (
                <div className="text-gray-400 text-sm">No recent tasks</div>
            ) : (
                <div className="space-y-2">
                    {tasks.map(task => (
                        <div key={task.uid} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-600'}`}>
                                    {task.status}
                                </span>
                                <span className="text-sm text-gray-700 truncate">{task.type}</span>
                                {task.indexUid && (
                                    <span className="text-xs text-gray-400 truncate">{task.indexUid}</span>
                                )}
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                {formatTimeAgo(task.enqueuedAt)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentTasksCard;
