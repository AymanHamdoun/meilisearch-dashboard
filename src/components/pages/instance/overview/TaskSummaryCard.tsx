import React from 'react';
import TaskStatsChart from '../../../charts/TaskStatsChart';

interface TaskSummaryCardProps {
    taskStats: Record<string, number> | null;
}

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ taskStats }) => {
    return (
        <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Task Status</h3>
            {taskStats ? (
                <TaskStatsChart stats={taskStats} />
            ) : (
                <div className="text-gray-400 text-sm">Task stats unavailable</div>
            )}
        </div>
    );
};

export default TaskSummaryCard;
