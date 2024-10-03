// mockApi.js
import fetchMock from 'fetch-mock';

const apisToMock = {
    '/api/v1/contact': {success: true, message: "Message Sent !"},
    '/api/v1/auth/login': {success: true, message: "", data: {"id": 1, "name": "Test User", "token": "abc"}},
    '/api/v1/auth/logout': {success: true, message: ""},
    '/api/v1/auth/ping': {success: true, message: "", data: {"id": 1, "name": "Test User", "token": "abc"}},
}

const meiliAPIsToMock = {
    '/indexes/': {"results":[{"uid":"index_a","createdAt":"2024-09-27T14:00:18.913553088Z","updatedAt":"2024-09-27T14:09:48.646947848Z","primaryKey":"ObjectID"},{"uid":"index_b","createdAt":"2024-09-27T14:00:18.913553088Z","updatedAt":"2024-09-27T14:09:48.646947848Z","primaryKey":"ObjectID"}],"offset":0,"limit":20,"total":1},
    '/indexes/.*/search.*$': {"hits":[{"aliases":[],"cast":["christian bale","christopher nolan","cillian murphy","gary oldman","katie holmes","liam neeson","michael caine"],"cast_ar":["غاري أولدمان","غاري اولدمان","كريستوفر نولان","كريستيان بيل","كيتي هولمز","كيليان مورفي","ليام نيسون","مايكل كاين"],"genres":["Action","Fantasy"],"genres_ar":["أكشن","خيالي"],"title":"Batman Begins","title_ar":"باتمان بيغنز","status":1,"content_popularity":100,"order":1,"objectID":"22886"},{"aliases":[],"cast":["christian bale","christopher nolan","cillian murphy","gary oldman","katie holmes","liam neeson","michael caine"],"cast_ar":["غاري أولدمان","غاري اولدمان","كريستوفر نولان","كريستيان بيل","كيتي هولمز","كيليان مورفي","ليام نيسون","مايكل كاين"],"genres":["Action","Fantasy"],"genres_ar":["أكشن","خيالي"],"title":"Batman Begins","title_ar":"باتمان بيغنز","status":1,"content_popularity":100,"order":1,"objectID":"22886"},{"aliases":[],"cast":["christian bale","christopher nolan","cillian murphy","gary oldman","katie holmes","liam neeson","michael caine"],"cast_ar":["غاري أولدمان","غاري اولدمان","كريستوفر نولان","كريستيان بيل","كيتي هولمز","كيليان مورفي","ليام نيسون","مايكل كاين"],"genres":["Action","Fantasy"],"genres_ar":["أكشن","خيالي"],"title":"Batman Begins","title_ar":"باتمان بيغنز","status":1,"content_popularity":100,"order":1,"objectID":"22886"}],"query":"result","processingTimeMs":1789,"limit":20,"offset":0,"estimatedTotalHits":1000},
}

export const setupMocks = () => {
    // Check the environment variable
    if (process.env.USE_MOCK_API !== 'true') {
        return
    }

    for (const [apiUrl, mockedResponse] of Object.entries(apisToMock)) {
        const fullApiUrl = process.env.API_HOST + apiUrl
        // Intercept API calls and provide mock responses
        fetchMock.mock(fullApiUrl, {
            status: 200,
            body: mockedResponse,
        });
    }

    for (const [meiliApiUrl, meiliMockedResponse] of Object.entries(meiliAPIsToMock)) {
        const fullApiUrl = process.env.MEILI_HOST + meiliApiUrl
        // Intercept API calls and provide mock responses

        if (fullApiUrl.includes(".*")) {
            const regexp = new RegExp(fullApiUrl)
            fetchMock.mock(regexp, {
                status: 200,
                body: meiliMockedResponse,
            });
            continue;
        }
        fetchMock.mock(fullApiUrl, {
            status: 200,
            body: meiliMockedResponse,
        });
    }

    // Catch all unmatched requests
    fetchMock.catch({
        status: 404,
        body: { message: 'Not found', hits: [] }
    });
};