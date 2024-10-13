import { string } from "prop-types"
import { QueryType } from "./types"

type SearchWrapperOptions = {
    queryType: QueryType,
    query: string,
    instanceKey: string,
    indexName: string
}

const indexSearchWrapper = (options: SearchWrapperOptions) => {
    console.log(options)

    if (options.queryType == QueryType.ByQuery) {
        return basicSearch(options)
    }

    return getDocByObjectID(options).then((res) => {
        return {hits: [res]}
    })
}


const basicSearch = (options: SearchWrapperOptions) => {
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

    const url = `${host}/indexes/${options.indexName}/search?q=${options.query}`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

const getDocByObjectID = (options: SearchWrapperOptions) => {
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

    const url = `${host}/indexes/${options.indexName}/documents/${options.query}`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

export {
    indexSearchWrapper
}