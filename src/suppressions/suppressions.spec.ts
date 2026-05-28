import { afterEach, describe, expect, it, vi } from 'vitest'

import { SuppressionModel } from './suppressions.model'
import { UnsupportedEndpointError } from '../errors'
import { suppressionData, suppressionFilters } from '../test-support/fixtures'
import { createClient, expectedHeaders, mockJsonResponse, testBaseUrl } from '../test-support/http'

describe('Suppressions', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('gets a suppression by uuid', async () => {
        const fetchMock = mockJsonResponse({
            data: suppressionData
        })

        const suppression = await createClient().suppressions().get(suppressionData.uuid)

        expect(suppression).toBeInstanceOf(SuppressionModel)
        expect(suppression.uuid).toBe(suppressionData.uuid)
        expect(suppression.email).toBe(suppressionData.email)
        expect(suppression.type).toBe('manual')
        expect(suppression.createdAt).toEqual(new Date(suppressionData.created_at))
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/suppressions/suppression-id`, {
            headers: expectedHeaders()
        })
    })

    it('lists suppressions with search and filters', async () => {
        const fetchMock = mockJsonResponse({
            data: [suppressionData],
            meta: {
                current_page: 1,
                per_page: 10,
                total: 1,
                last_page: 1,
                has_next: false
            }
        })
        const suppressions = await createClient().suppressions().list({
            search: 'blocked',
            filters: suppressionFilters,
            page: 1,
            per_page: 10
        })

        expect(suppressions.data[0]).toBeInstanceOf(SuppressionModel)
        expect(suppressions.data[0]?.email).toBe(suppressionData.email)
        expect(suppressions.meta.total).toBe(1)
        expect(fetchMock).toHaveBeenCalledWith(
            `${testBaseUrl}/suppressions?search=blocked&filters=${encodeURIComponent(JSON.stringify(suppressionFilters))}&page=1&per_page=10`,
            {
                headers: expectedHeaders()
            }
        )
    })

    it('throws when updating a suppression', async () => {
        const fetchMock = vi.fn<typeof fetch>()

        vi.stubGlobal('fetch', fetchMock)

        await expect(createClient().suppressions().update(suppressionData.uuid, {
            type: 'manual'
        })).rejects.toThrow(UnsupportedEndpointError)
        expect(fetchMock).not.toHaveBeenCalled()
    })
})
