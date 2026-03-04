import { useState, useEffect, useCallback } from 'react';
import useMeiliInstance from './useMeiliInstance';
import { getGlobalStats, getVersion, listIndexes } from '../services/meilisearch/indexes';
import { getHealth, getMetrics } from '../services/meilisearch/metrics';
import { getTasks, getTaskStats } from '../services/meilisearch/tasks';
import { getExperimentalFeatures } from '../services/meilisearch/settings';

interface VersionInfo {
    pkgVersion: string;
    commitSha: string;
    commitDate: string;
}

interface IndexInfo {
    numberOfDocuments: number;
    isIndexing: boolean;
}

interface GlobalStats {
    databaseSize: number;
    lastUpdate: string;
    indexes: Record<string, IndexInfo>;
}

interface IndexItem {
    uid: string;
    primaryKey: string | null;
    createdAt: string;
    updatedAt: string;
}

interface TaskItem {
    uid: number;
    indexUid: string | null;
    status: string;
    type: string;
    enqueuedAt: string;
    startedAt?: string;
    finishedAt?: string;
    duration?: string;
    error?: { message: string; code: string };
}

export interface OverviewData {
    globalStats: GlobalStats | null;
    versionInfo: VersionInfo | null;
    healthStatus: string | null;
    taskStats: Record<string, number> | null;
    recentTasks: TaskItem[] | null;
    indexes: IndexItem[] | null;
    experimentalFeatures: Record<string, boolean> | null;
    metricsRaw: string | null;
    isLoading: boolean;
    errors: Record<string, string>;
    refresh: () => void;
}

const useOverviewData = (): OverviewData => {
    const { instanceState } = useMeiliInstance();
    const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
    const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
    const [healthStatus, setHealthStatus] = useState<string | null>(null);
    const [taskStats, setTaskStats] = useState<Record<string, number> | null>(null);
    const [recentTasks, setRecentTasks] = useState<TaskItem[] | null>(null);
    const [indexes, setIndexes] = useState<IndexItem[] | null>(null);
    const [experimentalFeatures, setExperimentalFeatures] = useState<Record<string, boolean> | null>(null);
    const [metricsRaw, setMetricsRaw] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchAll = useCallback(async () => {
        if (!instanceState.isLoaded) return;

        setIsLoading(true);
        setErrors({});

        const results = await Promise.allSettled([
            getGlobalStats(instanceState.host, instanceState.key),
            getVersion(instanceState.host, instanceState.key),
            getHealth(instanceState),
            getTaskStats(instanceState),
            getTasks(instanceState, { limit: 5 }),
            listIndexes(instanceState.host, instanceState.key),
            getExperimentalFeatures(instanceState),
            getMetrics(instanceState).catch(() => null),
        ]);

        const newErrors: Record<string, string> = {};

        // Global stats
        if (results[0].status === 'fulfilled') {
            setGlobalStats(results[0].value);
        } else {
            newErrors.globalStats = results[0].reason?.message || 'Failed to load stats';
        }

        // Version
        if (results[1].status === 'fulfilled') {
            setVersionInfo(results[1].value);
        } else {
            newErrors.version = results[1].reason?.message || 'Failed to load version';
        }

        // Health
        if (results[2].status === 'fulfilled') {
            setHealthStatus(results[2].value?.status || 'available');
        } else {
            setHealthStatus('unavailable');
        }

        // Task stats
        if (results[3].status === 'fulfilled') {
            setTaskStats(results[3].value);
        } else {
            newErrors.taskStats = results[3].reason?.message || 'Failed to load task stats';
        }

        // Recent tasks
        if (results[4].status === 'fulfilled') {
            setRecentTasks(results[4].value?.results || []);
        } else {
            newErrors.recentTasks = results[4].reason?.message || 'Failed to load recent tasks';
        }

        // Indexes
        if (results[5].status === 'fulfilled') {
            const indexData = results[5].value;
            setIndexes(indexData?.results || indexData || []);
        } else {
            newErrors.indexes = results[5].reason?.message || 'Failed to load indexes';
        }

        // Experimental features
        if (results[6].status === 'fulfilled') {
            setExperimentalFeatures(results[6].value);
        } else {
            newErrors.experimentalFeatures = results[6].reason?.message || 'Failed to load features';
        }

        // Metrics (optional, may not be enabled)
        if (results[7].status === 'fulfilled' && results[7].value) {
            setMetricsRaw(results[7].value);
        }

        setErrors(newErrors);
        setIsLoading(false);
    }, [instanceState]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        globalStats,
        versionInfo,
        healthStatus,
        taskStats,
        recentTasks,
        indexes,
        experimentalFeatures,
        metricsRaw,
        isLoading,
        errors,
        refresh: fetchAll,
    };
};

export default useOverviewData;
