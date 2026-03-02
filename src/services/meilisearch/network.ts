import { InstanceState } from "../../contexts/InstanceContext";
import { fetchWithTimeout } from "./fetchWithTimeout";

export const getNetwork = (instance: InstanceState) => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/network`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Get network error:', error);
            throw error;
        });
}

export const updateNetwork = (instance: InstanceState, networkConfig: any) => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(networkConfig),
        redirect: "follow"
    };

    const url = `${instance.host}/network`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Update network error:', error);
            throw error;
        });
}
