import { string } from "prop-types"
import { fetchWithTimeout } from "./fetchWithTimeout"

type SettingsAPIOptions = {
    host: string
    instanceKey: string,
    indexName: string
}

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