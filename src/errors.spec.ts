import { afterEach, describe, expect, it, vi } from 'vitest'

import { UnauthorizedError } from './errors'
import { createClient, mockJsonResponse } from './test-support/http'

describe('API errors', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('throws an unauthorized error for 401 responses', async () => {
        const payload = {
            message: 'Unauthenticated.'
        }

        mockJsonResponse(payload, {
            status: 401
        })

        try {
            await createClient('bad-key').contacts().list()
            throw new Error('Expected contacts list to throw.')
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedError)

            if (error instanceof UnauthorizedError) {
                expect(error.status).toBe(401)
                expect(error.response).toEqual(payload)
                expect(error.message).toBe('Unauthorized. Check your Leadpush API key.')
            }
        }
    })
})
