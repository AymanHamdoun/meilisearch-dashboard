const MASTER_KEY = "jbk3h3v32ghjbkrhv423bj4khv3bk2h3v2bjk3h2jv3bkj2"

const listIndexes = () => {
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

    const url = `${host}/indexes/`;


    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

export {
    listIndexes
}