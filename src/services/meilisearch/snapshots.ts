import { InstanceState } from "../../contexts/InstanceContext";
import { fetchWithTimeout } from "./fetchWithTimeout";

export interface CreateSnapshotResponse {
    taskUid: number;
    indexUid: string | null;
    status: string;
    type: string;
    enqueuedAt: string;
}

export const createSnapshot = async (instance: InstanceState): Promise<CreateSnapshotResponse> => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/snapshots`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Create snapshot error:', error);
            throw error;
        });
}