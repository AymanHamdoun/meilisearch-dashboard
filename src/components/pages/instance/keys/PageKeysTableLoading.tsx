import React from 'react';

const PageKeysTableLoading: React.FC = () => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indexes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(3)].map((_, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PageKeysTableLoading;