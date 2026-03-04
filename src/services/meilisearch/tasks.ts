import { InstanceState } from "../../contexts/InstanceContext";
import {GetTaskResponse, GetBatchResponse} from "./types";
import { fetchWithTimeout } from "./fetchWithTimeout";

const _defaultResponse: GetTaskResponse = {results: [],total: 0,limit: 0,from: 0,next: null}

export interface TaskFilterOptions {
    statuses?: string[];
    types?: string[];
    indexUids?: string[];
    uids?: number[];
    from?: number;
    limit?: number;
    afterEnqueuedAt?: string;
    beforeEnqueuedAt?: string;
    afterStartedAt?: string;
    beforeStartedAt?: string;
    afterFinishedAt?: string;
    beforeFinishedAt?: string;
}

export const getTasks = async (instance: InstanceState, options?: TaskFilterOptions): Promise<GetTaskResponse> => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    // Build query parameters
    const params = new URLSearchParams();

    if (options?.from !== undefined) {
        params.append('from', options.from.toString());
    }

    if (options?.limit !== undefined) {
        params.append('limit', options.limit.toString());
    }

    // According to Meilisearch API docs, multiple values should be comma-separated
    if (options?.statuses && options.statuses.length > 0) {
        params.append('statuses', options.statuses.join(','));
    }

    if (options?.types && options.types.length > 0) {
        params.append('types', options.types.join(','));
    }

    if (options?.indexUids && options.indexUids.length > 0) {
        params.append('indexUids', options.indexUids.join(','));
    }

    if (options?.uids && options.uids.length > 0) {
        params.append('uids', options.uids.join(','));
    }

    if (options?.afterEnqueuedAt) params.append('afterEnqueuedAt', options.afterEnqueuedAt);
    if (options?.beforeEnqueuedAt) params.append('beforeEnqueuedAt', options.beforeEnqueuedAt);
    if (options?.afterStartedAt) params.append('afterStartedAt', options.afterStartedAt);
    if (options?.beforeStartedAt) params.append('beforeStartedAt', options.beforeStartedAt);
    if (options?.afterFinishedAt) params.append('afterFinishedAt', options.afterFinishedAt);
    if (options?.beforeFinishedAt) params.append('beforeFinishedAt', options.beforeFinishedAt);

    const url = `${instance.host}/tasks${params.toString() ? '?' + params.toString() : ''}`;

    let data = await fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Get tasks error:', error);
            throw error;
        });

    return data as GetTaskResponse
}

export const getTaskStats = async (instance: InstanceState): Promise<{ [key: string]: number }> => {
    const data = {
        'enqueued': 0,
        'processing': 0,
        'succeeded': 0,
        'failed': 0,
        'canceled': 0,
    };

    // Make all status requests concurrently instead of sequentially
    const statusPromises = Object.keys(data).map(status =>
        getStatusTaskResponse(instance, status)
    );

    try {
        const results = await Promise.all(statusPromises);
        const statuses = Object.keys(data);

        results.forEach((result, index) => {
            data[statuses[index]] = result.total;
        });

        return data;
    } catch (error) {
        console.error('Get task stats error:', error);
        return data;
    }
}

export const cancelTasks = async (instance: InstanceState, options?: TaskFilterOptions) => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const params = new URLSearchParams();
    if (options?.statuses?.length) params.append('statuses', options.statuses.join(','));
    if (options?.types?.length) params.append('types', options.types.join(','));
    if (options?.indexUids?.length) params.append('indexUids', options.indexUids.join(','));
    if (options?.uids?.length) params.append('uids', options.uids.join(','));

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/tasks/cancel${params.toString() ? '?' + params.toString() : ''}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Cancel tasks error:', error);
            throw error;
        });
}

export const deleteTasks = async (instance: InstanceState, options?: TaskFilterOptions) => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const params = new URLSearchParams();
    if (options?.statuses?.length) params.append('statuses', options.statuses.join(','));
    if (options?.types?.length) params.append('types', options.types.join(','));
    if (options?.indexUids?.length) params.append('indexUids', options.indexUids.join(','));
    if (options?.uids?.length) params.append('uids', options.uids.join(','));

    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/tasks${params.toString() ? '?' + params.toString() : ''}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Delete tasks error:', error);
            throw error;
        });
}

export const getTask = async (instance: InstanceState, uid: number) => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/tasks/${uid}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Get task error:', error);
            throw error;
        });
}

export const getBatches = async (instance: InstanceState, options?: { from?: number; limit?: number }): Promise<GetBatchResponse> => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const params = new URLSearchParams();
    if (options?.from !== undefined) params.append('from', options.from.toString());
    if (options?.limit !== undefined) params.append('limit', options.limit.toString());

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/batches${params.toString() ? '?' + params.toString() : ''}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Get batches error:', error);
            throw error;
        });
}

const getStatusTaskResponse = (instance: InstanceState, status: string) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    // Add limit=1 since we only need the total count for stats
    const url = `${instance.host}/tasks?statuses=${status}&limit=1`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Get status task error:', error);
            return _defaultResponse
        });
}