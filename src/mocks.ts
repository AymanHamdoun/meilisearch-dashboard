import fetchMock from 'fetch-mock';

const meiliAPIsToMock: Record<string, unknown> = {
    '/indexes/': { "results": [{ "uid": "index_a", "createdAt": "2024-09-27T14:00:18.913553088Z", "updatedAt": "2024-09-27T14:09:48.646947848Z", "primaryKey": "ObjectID" }, { "uid": "index_b", "createdAt": "2024-09-27T14:00:18.913553088Z", "updatedAt": "2024-09-27T14:09:48.646947848Z", "primaryKey": "ObjectID" }], "offset": 0, "limit": 20, "total": 1 },
    '/indexes/.*/search.*$': { "hits": [{ "aliases": [], "cast": ["christian bale", "christopher nolan", "cillian murphy", "gary oldman", "katie holmes", "liam neeson", "michael caine"], "genres": ["Action", "Fantasy"], "title": "Batman Begins", "status": 1, "content_popularity": 100, "order": 1, "objectID": "22886" }], "query": "result", "processingTimeMs": 1789, "limit": 20, "offset": 0, "estimatedTotalHits": 1000 },
    '/tasks.*$': { "results": [], "total": 0, "limit": 20, "from": 0, "next": null },
    '/indexes/.*/documents/.*$': { "title": "Batman Begins", "objectID": "22886" },
    '/indexes/.*/settings': { "displayedAttributes": ["*"], "searchableAttributes": ["*"], "filterableAttributes": [], "sortableAttributes": [], "rankingRules": ["words", "typo", "proximity", "attribute", "sort", "exactness"] },
    '/indexes/.*/stats': { "numberOfDocuments": 20676632, "isIndexing": true, "fieldDistribution": { "name": 20676632, "objectID": 20676632 } },
};

export const setupMocks = (): void => {
    fetchMock.config.fallbackToNetwork = true;

    if (process.env.MOCK_MEILI_API === 'true') {
        for (const [meiliApiUrl, meiliMockedResponse] of Object.entries(meiliAPIsToMock)) {
            const fullApiUrl = process.env.MEILI_HOST + meiliApiUrl;
            if (fullApiUrl.includes(".*")) {
                fetchMock.mock(new RegExp(fullApiUrl), { status: 200, body: meiliMockedResponse });
                continue;
            }
            fetchMock.mock(fullApiUrl, { status: 200, body: meiliMockedResponse });
        }
    }
};
