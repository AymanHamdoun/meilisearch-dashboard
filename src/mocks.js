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
    '/tasks.*$': {"results":[{"uid":67690,"indexUid":"cars_lb","status":"failed","type":"documentAdditionOrUpdate","canceledBy":null,"details":{"receivedDocuments":55,"indexedDocuments":0},"error":{"message":"Document identifier `\"ج_210897\"` is invalid. A document identifier can be of type integer or string, only composed of alphanumeric characters (a-z A-Z 0-9), hyphens (-) and underscores (_).","code":"invalid_document_id","type":"invalid_request","link":"https://docs.meilisearch.com/errors#invalid_document_id"},"duration":"PT169.329702651S","enqueuedAt":"2024-10-04T23:02:45.238828593Z","startedAt":"2024-10-04T23:02:56.748738703Z","finishedAt":"2024-10-04T23:05:46.078441354Z"},{"uid":67689,"indexUid":"cars_lb","status":"failed","type":"documentAdditionOrUpdate","canceledBy":null,"details":{"receivedDocuments":500,"indexedDocuments":0},"error":{"message":"Document identifier `\"ص_172827\"` is invalid. A document identifier can be of type integer or string, only composed of alphanumeric characters (a-z A-Z 0-9), hyphens (-) and underscores (_).","code":"invalid_document_id","type":"invalid_request","link":"https://docs.meilisearch.com/errors#invalid_document_id"},"duration":"PT169.329702651S","enqueuedAt":"2024-10-04T23:02:45.230724907Z","startedAt":"2024-10-04T23:02:56.748738703Z","finishedAt":"2024-10-04T23:05:46.078441354Z"},{"uid":67688,"indexUid":"cars_lb","status":"failed","type":"documentAdditionOrUpdate","canceledBy":null,"details":{"receivedDocuments":500,"indexedDocuments":0},"error":{"message":"Document identifier `\"ط_181931\"` is invalid. A document identifier can be of type integer or string, only composed of alphanumeric characters (a-z A-Z 0-9), hyphens (-) and underscores (_).","code":"invalid_document_id","type":"invalid_request","link":"https://docs.meilisearch.com/errors#invalid_document_id"},"duration":"PT169.329702651S","enqueuedAt":"2024-10-04T23:02:45.212488244Z","startedAt":"2024-10-04T23:02:56.748738703Z","finishedAt":"2024-10-04T23:05:46.078441354Z"}],"total":67691,"limit":20,"from":67690,"next":67670},
}

export const setupMocks = () => {
    fetchMock.config.fallbackToNetwork = true;

    // Check the environment variable
    if (process.env.MOCK_API === 'true') {
        for (const [apiUrl, mockedResponse] of Object.entries(apisToMock)) {
            const fullApiUrl = process.env.API_HOST + apiUrl
            // Intercept API calls and provide mock responses
            fetchMock.mock(fullApiUrl, {
                status: 200,
                body: mockedResponse,
            });
        }
    }

    if (process.env.MOCK_MEILI_API === 'true') {
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
    }
};