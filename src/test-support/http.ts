import { vi } from 'vitest'

import { API_VERSION, DEFAULT_USER_AGENT, Leadpush, SDK_NAME, SDK_VERSION, type Options } from '../leadpush'

export const testBaseUrl = 'https://api.leadpush.test/v1'

export function createClient(key = 'test-key', options: Partial<Options> = {}): Leadpush {
    return new Leadpush(key, {
        baseUrl: testBaseUrl,
        timeout: 0,
        ...options
    })
}

export function expectedHeaders(headers: Record<string, string> = {}, key = 'test-key'): Record<string, string> {
    return {
        Accept: 'application/json',
        Authorization: `Bearer ${key}`,
        'X-Leadpush-API-Version': API_VERSION,
        'X-Leadpush-SDK': SDK_NAME,
        'X-Leadpush-SDK-Version': SDK_VERSION,
        'User-Agent': DEFAULT_USER_AGENT,
        ...headers
    }
}

export function jsonResponse(payload: unknown, init: ResponseInit = {}): Response {
    const headers = new Headers(init.headers)

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }

    return new Response(JSON.stringify(payload), {
        ...init,
        headers
    })
}

export function mockJsonResponse(payload: unknown, init?: ResponseInit): ReturnType<typeof vi.fn<typeof fetch>> {
    const fetchMock = vi.fn<typeof fetch>()

    fetchMock.mockResolvedValue(jsonResponse(payload, init))
    vi.stubGlobal('fetch', fetchMock)

    return fetchMock
}

export function mockEmptyResponse(init: ResponseInit = {}): ReturnType<typeof vi.fn<typeof fetch>> {
    const fetchMock = vi.fn<typeof fetch>()

    fetchMock.mockResolvedValue(new Response(null, init))
    vi.stubGlobal('fetch', fetchMock)

    return fetchMock
}

export function mockJsonResponses(
    ...responses: Array<{ payload: unknown, init?: ResponseInit }>
): ReturnType<typeof vi.fn<typeof fetch>> {
    const fetchMock = vi.fn<typeof fetch>()

    for (const response of responses) {
        fetchMock.mockResolvedValueOnce(jsonResponse(response.payload, response.init))
    }

    vi.stubGlobal('fetch', fetchMock)

    return fetchMock
}
