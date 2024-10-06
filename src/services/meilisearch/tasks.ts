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

    const url = `${instance.host}/tasks?from=${from}`;


    let data = await fetch(url, requestOptions)
        .then((response) => {return response.json()})
        .catch((error) => {
            console.error(error);
            return _defaultResponse
        });

    return data as GetTaskResponse
}