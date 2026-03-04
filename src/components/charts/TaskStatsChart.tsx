import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TaskStatsChartProps {
    stats: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
    succeeded: '#22c55e',
    failed: '#ef4444',
    enqueued: '#f59e0b',
    processing: '#3b82f6',
    canceled: '#9ca3af',
};

const TaskStatsChart: React.FC<TaskStatsChartProps> = ({ stats }) => {
    const data = Object.entries(stats)
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            key: name,
        }));

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No task data available
            </div>
        );
    }

    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry) => (
                            <Cell
                                key={entry.key}
                                fill={STATUS_COLORS[entry.key] || '#6b7280'}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'Tasks']}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '0.8rem'
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                            <span className="text-xs text-gray-600">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-2">
                <span className="text-lg font-semibold text-gray-800">{total.toLocaleString()}</span>
                <span className="text-xs text-gray-400 ml-1">total</span>
            </div>
        </div>
    );
};

export default TaskStatsChart;
