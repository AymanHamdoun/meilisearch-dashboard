import { InstanceState } from "../../contexts/InstanceContext";
import {GetTaskResponse} from "./types";

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


    let data = await fetch(url, requestOptions)
        .then((response) => {return response.json()})
        .catch((error) => {
            console.error(error);
            return _defaultResponse
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


    return fetch(url, requestOptions)
        .then((response) => {return response.json()})
        .catch((error) => {
            console.error(error);
            return _defaultResponse
        });
}