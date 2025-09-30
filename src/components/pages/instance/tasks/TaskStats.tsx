import React from 'react';

interface TaskStatsProps {
    total: number;
    stats: { [key: string]: number };
}

const TaskStats: React.FC<TaskStatsProps> = ({ total, stats }) => {
    return (
        <div className="flex flex-wrap gap-2">
            <span className="text-gray-600 px-2 py-1 bg-gray-50 rounded">
                {total} Total
            </span>
            {Object.keys(stats).map((status, i) => (
                <span key={i} className="text-gray-500 px-2 py-1 bg-gray-50 rounded">
                    {stats[status]} {status}
                </span>
            ))}
        </div>
    );
};

export default TaskStats;