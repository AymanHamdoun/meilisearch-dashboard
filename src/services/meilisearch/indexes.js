const MASTER_KEY = "3SsjIXd1CvKfpIU-EV7RqkF8J7wM1gOVo4lC1WwnKy8" 

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