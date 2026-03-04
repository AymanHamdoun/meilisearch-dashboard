import { InstanceState } from "../../contexts/InstanceContext";
import { fetchWithTimeout } from "./fetchWithTimeout";

export const getMetrics = (instance: InstanceState): Promise<string> => {
    const myHeaders = new Headers({
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/metrics`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                let errorMessage = `API error: ${response.status}`;
                try {
                    const data = await response.json();
                    errorMessage = data.message || errorMessage;
                } catch {
                    // Response might not be JSON
                }
                throw new Error(errorMessage);
            }
            return response.text();
        })
        .catch((error) => {
            console.error('Get metrics error:', error);
            throw error;
        });
}

export const getHealth = (instance: InstanceState) => {
    const myHeaders = new Headers({
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/health`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Get health error:', error);
            throw error;
        });
}
