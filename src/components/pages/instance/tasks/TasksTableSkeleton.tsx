import React from 'react';

const TasksTableSkeleton: React.FC = () => {
    const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </th>
                        <th className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {skeletonRows.map((i) => (
                        <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-10"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TasksTableSkeleton;