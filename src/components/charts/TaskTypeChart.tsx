import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { TaskType } from '../../services/meilisearch/tasks';

interface TaskTypeChartProps {
    stats: Record<string, number>;
}

const LABELS: Record<string, string> = {
    documentAdditionOrUpdate: 'Doc Add/Update',
    documentDeletion: 'Doc Delete',
    documentDeletionByFilter: 'Doc Delete (Filter)',
    settingsUpdate: 'Settings Update',
    indexCreation: 'Index Create',
    indexUpdate: 'Index Update',
    indexDeletion: 'Index Delete',
    indexSwap: 'Index Swap',
    taskCancelation: 'Task Cancel',
    taskDeletion: 'Task Delete',
    dumpCreation: 'Dump Create',
    snapshotCreation: 'Snapshot Create',
};

const COLORS: Record<string, string> = {
    documentAdditionOrUpdate: '#5a67f2',
    documentDeletion: '#818cf8',
    documentDeletionByFilter: '#a5b4fc',
    settingsUpdate: '#f59e0b',
    indexCreation: '#22c55e',
    indexUpdate: '#16a34a',
    indexDeletion: '#ef4444',
    indexSwap: '#06b6d4',
    taskCancelation: '#9ca3af',
    taskDeletion: '#6b7280',
    dumpCreation: '#4b5563',
    snapshotCreation: '#374151',
};

const CATEGORIES: { label: string; color: string; types: string[] }[] = [
    { label: 'Document writes', color: '#5a67f2', types: ['documentAdditionOrUpdate', 'documentDeletion', 'documentDeletionByFilter'] },
    { label: 'Index ops', color: '#22c55e', types: ['indexCreation', 'indexUpdate', 'indexDeletion', 'indexSwap'] },
    { label: 'Config', color: '#f59e0b', types: ['settingsUpdate'] },
    { label: 'Maintenance', color: '#6b7280', types: ['taskCancelation', 'taskDeletion', 'dumpCreation', 'snapshotCreation'] },
];

const TaskTypeChart: React.FC<TaskTypeChartProps> = ({ stats }) => {
    const data = Object.entries(stats)
        .map(([type, count]) => ({ type, label: LABELS[type] ?? type, count }))
        .filter(d => d.count > 0)
        .sort((a, b) => b.count - a.count);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No task history yet
            </div>
        );
    }

    return (
        <div>
            <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 4, right: 40, left: 140, bottom: 4 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={(v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : String(v)}
                    />
                    <YAxis
                        type="category"
                        dataKey="label"
                        tick={{ fontSize: 12, fill: '#374151' }}
                        tickLine={false}
                        axisLine={false}
                        width={136}
                    />
                    <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'tasks']}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '0.8rem',
                        }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.map((entry) => (
                            <Cell key={entry.type} fill={COLORS[entry.type] ?? '#9ca3af'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 px-1">
                {CATEGORIES.map(cat => (
                    <span key={cat.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                        {cat.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TaskTypeChart;
