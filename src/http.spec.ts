import { afterEach, describe, expect, it, vi } from 'vitest'

import { TimeoutError } from './errors'
import { Leadpush } from './leadpush'
import { createClient, expectedHeaders, mockJsonResponse, testBaseUrl } from './test-support/http'

describe('HTTP requests', () => {
    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllGlobals()
    })

    it('throws a timeout error when a request exceeds the configured timeout', async () => {
        vi.useFakeTimers()

        const fetchMock = vi.fn<typeof fetch>((_input, init) => new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
                const error = new Error('aborted')

                error.name = 'AbortError'
                reject(error)
            })
        }))

        vi.stubGlobal('fetch', fetchMock)

        const request = new Leadpush('test-key', {
            baseUrl: testBaseUrl,
            headers: {
                'X-Test-Header': 'test-value'
            },
            timeout: 10,
            userAgent: 'test-agent'
        }).get('contacts')

        const expectation = expect(request).rejects.toBeInstanceOf(TimeoutError)

        await vi.advanceTimersByTimeAsync(10)
        await expectation
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts`, {
            headers: expectedHeaders({
                'X-Test-Header': 'test-value',
                'User-Agent': 'test-agent'
            }),
            signal: expect.any(AbortSignal) as AbortSignal
        })
    })

    it('makes a DELETE request', async () => {
        const fetchMock = mockJsonResponse({
            deleted: true
        })
        const result = await createClient().delete<{ deleted: boolean }>(['contacts', 'contact-id'], {
            force: true
        })

        expect(result.deleted).toBe(true)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts/contact-id?force=true`, {
            method: 'DELETE',
            headers: expectedHeaders()
        })
    })
})
