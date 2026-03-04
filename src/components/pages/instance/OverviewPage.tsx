import React from "react";
import useOverviewData from "../../../hooks/useOverviewData";
import HealthStatusCard from "./overview/HealthStatusCard";
import DatabaseStatsCard from "./overview/DatabaseStatsCard";
import IndexSummaryCard from "./overview/IndexSummaryCard";
import TaskSummaryCard from "./overview/TaskSummaryCard";
import RecentTasksCard from "./overview/RecentTasksCard";
import ExperimentalFeaturesCard from "./overview/ExperimentalFeaturesCard";
import MetricsPreviewCard from "./overview/MetricsPreviewCard";

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-5 h-36">
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-5 h-64">
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
                    <div className="h-32 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    </div>
);

const OverviewPage = () => {
    const {
        globalStats,
        versionInfo,
        healthStatus,
        taskStats,
        recentTasks,
        indexes,
        experimentalFeatures,
        metricsRaw,
        isLoading,
        refresh,
    } = useOverviewData();

    return (
        <div className="bg-gray-100 bg-opacity-70 min-h-screen p-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-semibold">Overview</h3>
                <button
                    onClick={refresh}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {isLoading && !globalStats ? (
                <LoadingSkeleton />
            ) : (
                <div className="space-y-4">
                    {/* Top row: Health, DB Stats, Indexes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <HealthStatusCard healthStatus={healthStatus} versionInfo={versionInfo} />
                        <DatabaseStatsCard globalStats={globalStats} />
                        <IndexSummaryCard indexes={indexes} globalStats={globalStats} />
                    </div>

                    {/* Middle row: Task Chart, Recent Tasks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TaskSummaryCard taskStats={taskStats} />
                        <RecentTasksCard tasks={recentTasks} />
                    </div>

                    {/* Bottom row: Features, Metrics Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ExperimentalFeaturesCard features={experimentalFeatures} />
                        <MetricsPreviewCard metricsRaw={metricsRaw} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewPage;
