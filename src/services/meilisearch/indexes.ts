import { InstanceState } from "../../contexts/InstanceContext";

const listIndexes = (host, masterKey) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/indexes/`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

const getIndexStats = (host, masterKey, indexName) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/indexes/${indexName}/stats`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

type CreateIndexOptions = {
    instance: InstanceState,
    indexName: string,
    primaryKey: string
}

const createIndex = (options: CreateIndexOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    interface CreateIndexBodyOptions {
        uid: string;
        primaryKey?: string;
      }

    let body: CreateIndexBodyOptions = {
        uid: options.indexName
    }

    if (options.primaryKey.length > 0) {
        body.primaryKey = options.primaryKey
    }

    const requestOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify(body),
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

export {
    listIndexes,
    getIndexStats,
    createIndex
}