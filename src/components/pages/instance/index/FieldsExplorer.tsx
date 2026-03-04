import React, { useState, useEffect } from 'react';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import useMeiliIndex from '../../../../hooks/useMeiliIndex';
import { getIndexStats } from '../../../../services/meilisearch/indexes';

interface FieldDistribution {
    [field: string]: number;
}

const FieldsExplorer: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const { meiliIndexState } = useMeiliIndex();
    const indexName = meiliIndexState.selectedIndex;

    const [fieldDistribution, setFieldDistribution] = useState<FieldDistribution | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!instanceState.isLoaded || !indexName) return;
        setIsLoading(true);
        setError(null);

        getIndexStats(instanceState.host, instanceState.key, indexName)
            .then((stats: any) => {
                setFieldDistribution(stats.fieldDistribution || {});
                setIsLoading(false);
            })
            .catch((err: any) => {
                setError(err.message || 'Failed to load field distribution');
                setIsLoading(false);
            });
    }, [instanceState, indexName]);

    if (!indexName) {
        return <div className="text-center py-12 text-gray-500">Select an index to view fields.</div>;
    }

    if (isLoading) {
        return <div className="text-center py-12 text-gray-500">Loading field distribution...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>;
    }

    const fields = fieldDistribution ? Object.entries(fieldDistribution).sort(([a], [b]) => a.localeCompare(b)) : [];
    const totalDocs = fields.length > 0 ? Math.max(...fields.map(([, count]) => count)) : 0;

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">Field Distribution</h2>
                <p className="text-sm text-gray-500">
                    Shows the number of documents containing each field in index "{indexName}".
                </p>
            </div>

            {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No fields found. Add documents to see field distribution.</div>
            ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-600">
                                <th className="py-3 px-4 font-medium">Field Name</th>
                                <th className="py-3 px-4 font-medium text-right">Documents</th>
                                <th className="py-3 px-4 font-medium">Coverage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map(([field, count]) => {
                                const percentage = totalDocs > 0 ? (count / totalDocs) * 100 : 0;
                                return (
                                    <tr key={field} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-2 px-4 font-mono text-gray-800">{field}</td>
                                        <td className="py-2 px-4 text-right text-gray-600">{count.toLocaleString()}</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 w-12 text-right">
                                                    {percentage.toFixed(0)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FieldsExplorer;
