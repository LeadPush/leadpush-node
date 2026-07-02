import { afterEach, describe, expect, it, vi } from 'vitest'

import { DomainAddressModel } from './domain-addresses.model'
import { DomainModel } from './domains.model'
import {
    createDomainAddressData,
    createDomainData,
    domainAddressData,
    domainData,
    verifiedDomainData
} from '../test-support/fixtures'
import {
    createClient,
    expectedHeaders,
    jsonResponse,
    mockEmptyResponse,
    mockJsonResponse,
    mockJsonResponses,
    testBaseUrl
} from '../test-support/http'

describe('Domains', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('lists domains with search and pagination', async () => {
        const fetchMock = mockJsonResponse({
            data: [domainData],
            meta: {
                current_page: 2,
                per_page: 1,
                total: 3,
                last_page: 3,
                has_next: true
            }
        })
        const domains = await createClient().domains().list({
            page: 2,
            per_page: 1,
            search: 'example'
        })

        expect(domains.data[0]).toBeInstanceOf(DomainModel)
        expect(domains.data[0]?.uuid).toBe(domainData.uuid)
        expect(domains.data[0]?.domain).toBe(domainData.domain)
        expect(domains.data[0]?.verified).toBe(false)
        expect(domains.data[0]?.provider).toBe('leadpush')
        expect(domains.data[0]?.status).toBe('pending')
        expect(domains.data[0]?.verification).toBe('pending')
        expect(domains.data[0]?.mailFromDomain).toBe(domainData.mail_from_domain)
        expect(domains.data[0]?.mailFromVerified).toBe(false)
        expect(domains.data[0]?.dns).toEqual(domainData.dns)
        expect(domains.data[0]?.createdAt).toEqual(new Date(domainData.created_at))
        expect(domains.data[0]?.updatedAt).toEqual(new Date(domainData.updated_at))
        expect(domains.data[0]?.toJSON()).toEqual(domainData)
        expect(domains.meta.total).toBe(3)
        expect(fetchMock).toHaveBeenCalledWith(
            `${testBaseUrl}/domains?page=2&per_page=1&search=example`,
            {
                headers: expectedHeaders()
            }
        )
    })

    it('gets a domain by uuid', async () => {
        const fetchMock = mockJsonResponse({
            data: domainData
        })

        const domain = await createClient().domains().get(domainData.uuid)

        expect(domain).toBeInstanceOf(DomainModel)
        expect(domain.uuid).toBe(domainData.uuid)
        expect(domain.name).toBe(domainData.name)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains/domain-uuid`, {
            headers: expectedHeaders()
        })
    })

    it('creates a domain', async () => {
        const fetchMock = mockJsonResponse({
            data: domainData
        })

        const domain = await createClient().domains().create(createDomainData)

        expect(domain).toBeInstanceOf(DomainModel)
        expect(domain.uuid).toBe(domainData.uuid)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(createDomainData)
        })
    })

    it('deletes a domain by uuid', async () => {
        const fetchMock = mockEmptyResponse({
            status: 204
        })
        const result = await createClient().domains().delete(domainData.uuid)

        expect(result).toBeUndefined()
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains/domain-uuid`, {
            method: 'DELETE',
            headers: expectedHeaders()
        })
    })

    it('refreshes domain verification by uuid', async () => {
        const fetchMock = mockJsonResponse({
            data: verifiedDomainData
        })

        const domain = await createClient().domains().verify(domainData.uuid)

        expect(domain).toBeInstanceOf(DomainModel)
        expect(domain.verified).toBe(true)
        expect(domain.verification).toBe('completed')
        expect(domain.mailFromVerified).toBe(true)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains/domain-uuid/verification`, {
            method: 'POST',
            headers: expectedHeaders()
        })
    })

    it('refreshes verification from an attached domain model', async () => {
        const fetchMock = mockJsonResponses(
            {
                payload: {
                    data: domainData
                }
            },
            {
                payload: {
                    data: verifiedDomainData
                }
            }
        )
        const domain = await createClient().domains().get(domainData.uuid)

        expect(domain.verified).toBe(false)

        const verified = await domain.verify()

        expect(verified).toBe(domain)
        expect(domain.verified).toBe(true)
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${testBaseUrl}/domains/domain-uuid/verification`, {
            method: 'POST',
            headers: expectedHeaders()
        })
    })

    it('deletes an attached domain model', async () => {
        const fetchMock = vi.fn<typeof fetch>()

        fetchMock
            .mockResolvedValueOnce(jsonResponse({
                data: domainData
            }))
            .mockResolvedValueOnce(new Response(null, {
                status: 204
            }))
        vi.stubGlobal('fetch', fetchMock)

        const domain = await createClient().domains().get(domainData.uuid)
        const result = await domain.delete()

        expect(result).toBeUndefined()
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${testBaseUrl}/domains/domain-uuid`, {
            method: 'DELETE',
            headers: expectedHeaders()
        })
    })

    it('lists domain addresses from the domains resource', async () => {
        const fetchMock = mockJsonResponse({
            data: [domainAddressData],
            meta: {
                current_page: 1,
                per_page: 10,
                total: 1,
                last_page: 1,
                has_next: false
            }
        })
        const addresses = await createClient().domains().addresses(domainData.uuid).list({
            page: 1,
            per_page: 10
        })

        expect(addresses.data[0]).toBeInstanceOf(DomainAddressModel)
        expect(addresses.data[0]?.uuid).toBe(domainAddressData.uuid)
        expect(addresses.data[0]?.domainUuid).toBe(domainData.uuid)
        expect(addresses.data[0]?.address).toBe(domainAddressData.address)
        expect(addresses.data[0]?.fullAddress).toBe(domainAddressData.full_address)
        expect(addresses.data[0]?.provider).toBe('leadpush')
        expect(addresses.data[0]?.displayName).toBe(domainAddressData.display_name)
        expect(addresses.data[0]?.verification).toBe('completed')
        expect(addresses.data[0]?.createdAt).toEqual(new Date(domainAddressData.created_at))
        expect(addresses.data[0]?.updatedAt).toEqual(new Date(domainAddressData.updated_at))
        expect(addresses.data[0]?.toJSON()).toEqual(domainAddressData)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains/domain-uuid/addresses?page=1&per_page=10`, {
            headers: expectedHeaders()
        })
    })

    it('lists domain addresses from an attached domain model', async () => {
        const fetchMock = mockJsonResponses(
            {
                payload: {
                    data: domainData
                }
            },
            {
                payload: {
                    data: [domainAddressData],
                    meta: {
                        current_page: 1,
                        per_page: 10,
                        total: 1,
                        last_page: 1,
                        has_next: false
                    }
                }
            }
        )
        const domain = await createClient().domains().get(domainData.uuid)
        const addresses = await domain.addresses().list()

        expect(addresses.data[0]).toBeInstanceOf(DomainAddressModel)
        expect(addresses.data[0]?.uuid).toBe(domainAddressData.uuid)
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${testBaseUrl}/domains/domain-uuid/addresses`, {
            headers: expectedHeaders()
        })
    })

    it('gets a nested domain address', async () => {
        const fetchMock = mockJsonResponse({
            data: domainAddressData
        })

        const address = await createClient().domains().addresses(domainData.uuid).get(domainAddressData.uuid)

        expect(address).toBeInstanceOf(DomainAddressModel)
        expect(address.uuid).toBe(domainAddressData.uuid)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains/domain-uuid/addresses/address-uuid`, {
            headers: expectedHeaders()
        })
    })

    it('creates a domain address', async () => {
        const fetchMock = mockJsonResponse({
            data: domainAddressData
        })

        const address = await createClient().domains().addresses(domainData.uuid).create(createDomainAddressData)

        expect(address).toBeInstanceOf(DomainAddressModel)
        expect(address.uuid).toBe(domainAddressData.uuid)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains/domain-uuid/addresses`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(createDomainAddressData)
        })
    })

    it('deletes a domain address by uuid', async () => {
        const fetchMock = mockEmptyResponse({
            status: 204
        })
        const result = await createClient().domains().addresses(domainData.uuid).delete(domainAddressData.uuid)

        expect(result).toBeUndefined()
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/domains/domain-uuid/addresses/address-uuid`, {
            method: 'DELETE',
            headers: expectedHeaders()
        })
    })

    it('deletes an attached domain address model', async () => {
        const fetchMock = vi.fn<typeof fetch>()

        fetchMock
            .mockResolvedValueOnce(jsonResponse({
                data: domainAddressData
            }))
            .mockResolvedValueOnce(new Response(null, {
                status: 204
            }))
        vi.stubGlobal('fetch', fetchMock)

        const address = await createClient().domains().addresses(domainData.uuid).get(domainAddressData.uuid)
        const result = await address.delete()

        expect(result).toBeUndefined()
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${testBaseUrl}/domains/domain-uuid/addresses/address-uuid`, {
            method: 'DELETE',
            headers: expectedHeaders()
        })
    })
})
