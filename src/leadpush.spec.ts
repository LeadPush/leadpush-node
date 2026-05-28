import { describe, expect, it } from 'vitest'

import { version } from '../package.json'
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_USER_AGENT, Leadpush, SDK_VERSION } from './leadpush'

describe('Leadpush', () => {
    it('exposes the SDK version', () => {
        const client = new Leadpush('test-key')

        expect(SDK_VERSION).toBe(version)
        expect(client.version).toBe(version)
    })

    it('stores the API key', () => {
        const client = new Leadpush('test-key')

        expect(client.key).toBe('test-key')
    })

    it('sets production request defaults', () => {
        const client = new Leadpush('test-key')

        expect(client.options).toEqual({
            baseUrl: DEFAULT_BASE_URL,
            headers: {},
            timeout: DEFAULT_TIMEOUT,
            userAgent: DEFAULT_USER_AGENT
        })
    })

    it('allows request defaults to be overridden', () => {
        const client = new Leadpush('test-key', {
            baseUrl: 'https://api.example.test/v2',
            headers: {
                'X-Custom-Header': 'custom-value'
            },
            timeout: 1000,
            userAgent: 'custom-agent'
        })

        expect(client.options).toEqual({
            baseUrl: 'https://api.example.test/v2',
            headers: {
                'X-Custom-Header': 'custom-value'
            },
            timeout: 1000,
            userAgent: 'custom-agent'
        })
    })
})
