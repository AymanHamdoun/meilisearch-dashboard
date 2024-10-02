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
    '/indexes/.*/search.*$': {"hits":[{"ObjectID":"10998556","Name":"result 1"},{"ObjectID":"68093714","Name":"result 2"},{"ObjectID":"9137844","Name":"result 3"}],"query":"result","processingTimeMs":1789,"limit":20,"offset":0,"estimatedTotalHits":1000},
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