import { string } from "prop-types"

type SettingsAPIOptions = {
    instanceKey: string,
    indexName: string
}

export const getIndexSettings = (options: SettingsAPIOptions) => {
    const host = process.env.MEILI_HOST

    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instanceKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/indexes/${options.indexName}/settings`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}