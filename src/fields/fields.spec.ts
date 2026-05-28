import { afterEach, describe, expect, it, vi } from 'vitest'

import { FieldModel } from './fields.model'
import { createFieldData, fieldData, fieldFilters } from '../test-support/fixtures'
import { createClient, expectedHeaders, mockJsonResponse, testBaseUrl } from '../test-support/http'

describe('Fields', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('gets a field by uuid', async () => {
        const fetchMock = mockJsonResponse({
            data: fieldData
        })

        const field = await createClient().fields().get(fieldData.uuid)

        expect(field).toBeInstanceOf(FieldModel)
        expect(field.uuid).toBe(fieldData.uuid)
        expect(field.name).toBe(fieldData.name)
        expect(field.type).toBe('text')
        expect(field.format?.text).toBe('url')
        expect(field.createdAt).toEqual(new Date(fieldData.created_at))
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/fields/field-uuid`, {
            headers: expectedHeaders()
        })
    })

    it('creates a field', async () => {
        const fetchMock = mockJsonResponse({
            data: fieldData
        })

        const field = await createClient().fields().create(createFieldData)

        expect(field).toBeInstanceOf(FieldModel)
        expect(field.uuid).toBe(fieldData.uuid)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/fields`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(createFieldData)
        })
    })

    it('lists fields with search and filters', async () => {
        const fetchMock = mockJsonResponse({
            data: [fieldData],
            meta: {
                current_page: 1,
                per_page: 10,
                total: 1,
                last_page: 1,
                has_next: false
            }
        })
        const fields = await createClient().fields().list({
            search: 'company',
            filters: fieldFilters,
            page: 1,
            per_page: 10
        })

        expect(fields.data[0]).toBeInstanceOf(FieldModel)
        expect(fields.data[0]?.name).toBe(fieldData.name)
        expect(fields.meta.total).toBe(1)
        expect(fetchMock).toHaveBeenCalledWith(
            `${testBaseUrl}/fields?search=company&filters=${encodeURIComponent(JSON.stringify(fieldFilters))}&page=1&per_page=10`,
            {
                headers: expectedHeaders()
            }
        )
    })
})
