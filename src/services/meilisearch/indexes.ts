import { InstanceState } from "../../contexts/InstanceContext";
import { fetchWithTimeout } from "./fetchWithTimeout";

const listIndexes = (host, masterKey) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/indexes/`;


    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                // For API errors, throw them as regular errors
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const getIndexStats = (host, masterKey, indexName) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/indexes/${indexName}/stats`;


    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                // Check if it's specifically an index not found error
                if (response.status === 404 && data.code === 'index_not_found') {
                    // Return a special error that can be handled by the caller
                    const error = new Error(data.message || 'Index not found');
                    (error as any).code = 'index_not_found';
                    (error as any).status = 404;
                    throw error;
                }
                // For other API errors, throw them as regular errors
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const getGlobalStats = (host, masterKey) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/stats`;


    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const getVersion = (host, masterKey) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${masterKey}`
    });

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${host}/version`;


    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

type CreateIndexOptions = {
    instance: InstanceState,
    indexName: string,
    primaryKey: string
}

const createIndex = (options: CreateIndexOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    interface CreateIndexBodyOptions {
        uid: string;
        primaryKey?: string;
      }

    let body: CreateIndexBodyOptions = {
        uid: options.indexName
    }

    if (options.primaryKey.length > 0) {
        body.primaryKey = options.primaryKey
    }

    const requestOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify(body),
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes`;


    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

type DeleteIndexOptions = {
    instance: InstanceState,
    indexName: string,
}
const deleteIndex = (options: DeleteIndexOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes/${options.indexName}`;
    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

type UploadDocumentsOptions = {
    instance: InstanceState,
    indexName: string,
    documents: any[]
}

const uploadDocuments = (options: UploadDocumentsOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify(options.documents),
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes/${options.indexName}/documents`;
    return fetchWithTimeout(url, requestOptions, 120_000)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                // Check for index not found error
                if (response.status === 404 && data.code === 'index_not_found') {
                    const error = new Error(data.message || 'Index not found');
                    (error as any).code = 'index_not_found';
                    (error as any).status = 404;
                    throw error;
                }
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

type ListDocumentsOptions = {
    instance: InstanceState,
    indexName: string,
    offset?: number,
    limit?: number,
    fields?: string[]
}

const listDocuments = (options: ListDocumentsOptions) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${options.instance.key}`
    });

    const params = new URLSearchParams();
    if (options.offset !== undefined) params.append('offset', options.offset.toString());
    if (options.limit !== undefined) params.append('limit', options.limit.toString());
    if (options.fields && options.fields.length > 0) params.append('fields', options.fields.join(','));

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${options.instance.host}/indexes/${options.indexName}/documents${params.toString() ? '?' + params.toString() : ''}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const deleteDocument = (instance: InstanceState, indexName: string, docId: string) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/indexes/${indexName}/documents/${docId}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const deleteAllDocuments = (instance: InstanceState, indexName: string) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/indexes/${indexName}/documents`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const deleteBatchDocuments = (instance: InstanceState, indexName: string, ids: (string | number)[]) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify(ids),
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/indexes/${indexName}/documents/delete-batch`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const deleteDocumentsByFilter = (instance: InstanceState, indexName: string, filter: string) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify({ filter }),
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/indexes/${indexName}/documents/delete`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const swapIndexes = (instance: InstanceState, swaps: Array<{ indexes: [string, string] }>) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify(swaps),
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/swap-indexes`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const updateIndex = (instance: InstanceState, indexName: string, primaryKey: string) => {
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${instance.key}`
    });

    const requestOptions: RequestInit = {
        method: "PATCH",
        body: JSON.stringify({ primaryKey }),
        headers: myHeaders,
        redirect: "follow"
    };

    const url = `${instance.host}/indexes/${indexName}`;

    return fetchWithTimeout(url, requestOptions)
        .then(async (response) => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `API error: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('API error:', error);
            throw error;
        });
}

const getIndex = (instance: InstanceState, indexName: string) => {
    return fetchWithTimeout(`${instance.host}/indexes/${indexName}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${instance.key}` }),
        redirect: 'follow',
    })
        .then(async (response) => {
            if (!response.ok) { const d = await response.json(); throw new Error(d.message || `API error: ${response.status}`); }
            return response.json();
        });
}

export {
    listIndexes,
    getIndexStats,
    getIndex,
    createIndex,
    deleteIndex,
    uploadDocuments,
    getGlobalStats,
    getVersion,
    listDocuments,
    deleteDocument,
    deleteAllDocuments,
    deleteBatchDocuments,
    deleteDocumentsByFilter,
    swapIndexes,
    updateIndex
}