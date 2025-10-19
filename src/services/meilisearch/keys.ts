import { fetchWithTimeout } from './fetchWithTimeout';

export interface MeiliKey {
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
    results: MeiliKey[];
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
): Promise<MeiliKey> {
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
): Promise<MeiliKey> {
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
): Promise<MeiliKey> {
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