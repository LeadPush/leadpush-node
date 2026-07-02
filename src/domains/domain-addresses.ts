import { ListableResource, type ListParams, type ResourceResponse } from '../entity'
import type { Leadpush } from '../leadpush'
import {
    DomainAddressModel,
    type CreateDomainAddressData,
    type DomainAddressData,
    type UpdateDomainAddressData
} from './domain-addresses.model'

export type ListDomainAddressesParams = ListParams

/**
 * Domain addresses API resource.
 */
export class DomainAddresses extends ListableResource<
    DomainAddressData,
    DomainAddressModel,
    UpdateDomainAddressData,
    ListDomainAddressesParams
> {
    /**
     * API path for domain addresses.
     */
    override endpoint: readonly string[]

    /**
     * Model class returned by domain address operations.
     */
    override model = DomainAddressModel

    /**
     * Create a domain addresses resource handler.
     *
     * @param client - Leadpush API client.
     * @param domainId - Parent domain uuid.
     */
    constructor(client: Leadpush, readonly domainId: string) {
        super(client)

        this.endpoint = ['domains', domainId, 'addresses']
    }

    /**
     * Create a domain address.
     *
     * @param data - Domain address creation payload.
     */
    async create(data: CreateDomainAddressData): Promise<DomainAddressModel> {
        const payload = await this.postResource<ResourceResponse<DomainAddressData>>(undefined, data)

        return this.makeModel(payload.data)
    }

    /**
     * Get a domain address by uuid.
     *
     * @param uuid - Domain address uuid.
     */
    async get(uuid: string): Promise<DomainAddressModel> {
        const payload = await this.getResource<ResourceResponse<DomainAddressData>>([uuid])

        return this.makeModel(payload.data)
    }

    /**
     * Delete a domain address by uuid.
     *
     * @param uuid - Domain address uuid.
     */
    async delete(uuid: string): Promise<void> {
        await this.deleteResource<void>([uuid])
    }
}
