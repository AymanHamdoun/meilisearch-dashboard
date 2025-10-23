import { fetchWithTimeout } from './fetchWithTimeout';

/**
 * KeyResource represents an API key resource returned by the Meilisearch API.
 * This is the response format from Meilisearch's /keys endpoints.
 *
 * Note: This is NOT the API key used by the dashboard to connect to Meilisearch.
 * The dashboard's connection key is stored in InstanceState.key.
 *
 * KeyResource is used for managing API keys within a Meilisearch instance:
 * - Creating new API keys with specific permissions
 * - Listing existing API keys
 * - Updating key metadata (name, description)
 * - Deleting API keys
 */
export interface KeyResource {
    name: string | null;
    description: string | null;
    key: string;
    uid: string;
    actions: string[];
    indexes: string[];
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateKeyPayload {
    name?: string | null;
    description?: string | null;
    actions: string[];
    indexes: string[];
    expiresAt: string | null;
}

export interface UpdateKeyPayload {
    name?: string | null;
    description?: string | null;
}

export interface KeysListResponse {
    results: KeyResource[];
    offset: number;
    limit: number;
    total: number;
}

export async function listKeys(
    meilisearchHost: string,
    meilisearchApiKey: string,
    limit = 20,
    offset = 0
): Promise<KeysListResponse> {
    const response = await fetchWithTimeout(
        `${meilisearchHost}/keys?limit=${limit}&offset=${offset}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${meilisearchApiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch keys');
    }

    return response.json();
}

export async function getKey(
    meilisearchHost: string,
    meilisearchApiKey: string,
    keyOrUid: string
): Promise<KeyResource> {
    const response = await fetchWithTimeout(
        `${meilisearchHost}/keys/${keyOrUid}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${meilisearchApiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch key');
    }

    return response.json();
}

export async function createKey(
    meilisearchHost: string,
    meilisearchApiKey: string,
    payload: CreateKeyPayload
): Promise<KeyResource> {
    const response = await fetchWithTimeout(
        `${meilisearchHost}/keys`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${meilisearchApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create key');
    }

    return response.json();
}

export async function updateKey(
    meilisearchHost: string,
    meilisearchApiKey: string,
    keyOrUid: string,
    payload: UpdateKeyPayload
): Promise<KeyResource> {
    const response = await fetchWithTimeout(
        `${meilisearchHost}/keys/${keyOrUid}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${meilisearchApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update key');
    }

    return response.json();
}

export async function deleteKey(
    meilisearchHost: string,
    meilisearchApiKey: string,
    keyOrUid: string
): Promise<void> {
    const response = await fetchWithTimeout(
        `${meilisearchHost}/keys/${keyOrUid}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${meilisearchApiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete key');
    }
}