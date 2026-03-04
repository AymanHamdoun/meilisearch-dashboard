import React from 'react';

interface HealthStatusCardProps {
    healthStatus: string | null;
    versionInfo: { pkgVersion: string; commitSha: string; commitDate: string } | null;
}

const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ healthStatus, versionInfo }) => {
    const isHealthy = healthStatus === 'available';

    return (
        <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Health</h3>
                <span className={`flex items-center gap-1.5 text-sm font-medium ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    {isHealthy ? 'Healthy' : healthStatus || 'Unknown'}
                </span>
            </div>
            {versionInfo ? (
                <div className="space-y-1.5">
                    <div className="text-2xl font-bold text-gray-800">v{versionInfo.pkgVersion}</div>
                    <div className="text-xs text-gray-400 font-mono truncate" title={versionInfo.commitSha}>
                        {versionInfo.commitSha.slice(0, 8)}
                    </div>
                    <div className="text-xs text-gray-400">
                        {new Date(versionInfo.commitDate).toLocaleDateString()}
                    </div>
                </div>
            ) : (
                <div className="text-gray-400 text-sm">Version info unavailable</div>
            )}
        </div>
    );
};

export default HealthStatusCard;
