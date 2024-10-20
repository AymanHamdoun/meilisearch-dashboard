import { string } from "prop-types"
import { QueryType } from "./types"
import { InstanceState } from "../../contexts/InstanceContext"

type SearchWrapperOptions = {
    instance: InstanceState,
    queryType: QueryType,
    query: string,
    indexName: string
}

const indexSearchWrapper = (options: SearchWrapperOptions) => {
    if (options.queryType == QueryType.ByQuery) {
        return basicSearch(options)
    }

    return getDocByObjectID(options).then((res) => {
        return {hits: [res]}
    })
}


const basicSearch = (options: SearchWrapperOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes/${options.indexName}/search?q=${options.query}`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

const getDocByObjectID = (options: SearchWrapperOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes/${options.indexName}/documents/${options.query}`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

export {
    indexSearchWrapper
}