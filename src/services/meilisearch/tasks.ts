import { InstanceState } from "../../contexts/InstanceContext";
import {GetTaskResponse} from "./types";
import { fetchWithTimeout } from "./fetchWithTimeout";

const _defaultResponse: GetTaskResponse = {results: [],total: 0,limit: 0,from: 0,next: 0}

export interface TaskFilterOptions {
    statuses?: string[];
    types?: string[];
    indexUids?: string[];
    from?: number;
    limit?: number;
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