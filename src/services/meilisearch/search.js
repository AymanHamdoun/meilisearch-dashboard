const MASTER_KEY = "jbk3h3v32ghjbkrhv423bj4khv3bk2h3v2bjk3h2jv3bkj2"
const basicSearch = (indexName, query) => {
    const host = process.env.MEILI_HOST

    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MASTER_KEY}`
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