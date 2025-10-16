import { fetchWithTimeout } from "./fetchWithTimeout"
import { InstanceState } from "../../contexts/InstanceContext"

type SettingsAPIOptions = {
    host: string
    instanceKey: string,
    indexName: string
}

// Dynamic type to handle any experimental features from the API
export type ExperimentalFeaturesResponse = Record<string, boolean>

export const getIndexSettings = (options: SettingsAPIOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instanceKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.host}/indexes/${options.indexName}/settings`;


    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            const status = response.status;
            const responseBody = await response.json()
            if (status >= 400) {
                throw new Error(responseBody.message);
            }

            return responseBody
        })
        .catch((error) => {
            console.error("error fetching index settings", error);
            throw error;
        });
}

export const getExperimentalFeatures = (instance: InstanceState): Promise<ExperimentalFeaturesResponse> => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/experimental-features`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            const status = response.status;
            const responseBody = await response.json();
            if (status >= 400) {
                throw new Error(responseBody.message || "Failed to fetch experimental features");
            }
            return responseBody;
        })
        .catch((error) => {
            console.error("Error fetching experimental features:", error);
            throw error;
        });
}

export const updateExperimentalFeatures = (
    instance: InstanceState,
    features: Partial<ExperimentalFeaturesResponse>
): Promise<ExperimentalFeaturesResponse> => {
    const myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(features),
        redirect: "follow"
    };

    const url = `${instance.host}/experimental-features`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            const status = response.status;
            const responseBody = await response.json();
            if (status >= 400) {
                throw new Error(responseBody.message || "Failed to update experimental features");
            }
            return responseBody;
        })
        .catch((error) => {
            console.error("Error updating experimental features:", error);
            throw error;
        });
}