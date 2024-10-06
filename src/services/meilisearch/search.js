const basicSearch = (instanceKey, indexName, query) => {
    const host = process.env.MEILI_HOST

    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instanceKey}`
    });

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/indexes/${indexName}/search?q=${query}`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

export {
    basicSearch
}