import { InstanceState } from "../../contexts/InstanceContext";
import {GetTaskResponse} from "./types";
import { fetchWithTimeout } from "./fetchWithTimeout";

const _defaultResponse: GetTaskResponse = {results: [],total: 0,limit: 0,from: 0,next: 0}

export const getTasks = async (instance: InstanceState, from: number): Promise<GetTaskResponse> => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/tasks`;


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
    let data = {
        'enqueued': 0,
        'processing': 0,
        'succeeded': 0,
        'failed': 0,
        'canceled': 0,
    }

    for (const [key, value] of Object.entries(data)) {
        const results = await getStatusTaskResponse(instance, key)
        data[key] = results.total
    }

    return data
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

    const url = `${instance.host}/tasks?statuses=${status}`;


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