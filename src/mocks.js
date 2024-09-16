// mockApi.js
import fetchMock from 'fetch-mock';

const apisToMock = {
    '/api/v1/contact': {success: true, message: "Message Sent !"},
    '/api/v1/auth/login': {success: true, message: "", data: {"id": 1, "name": "Test User", "token": "abc"}},
    '/api/v1/auth/logout': {success: true, message: ""},
    '/api/v1/auth/ping': {success: true, message: "", data: {"id": 1, "name": "Test User", "token": "abc"}},
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
};