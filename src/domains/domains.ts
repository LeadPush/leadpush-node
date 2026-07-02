import { ListableResource, type ListParams, type ResourceResponse } from '../entity'
import { DomainAddresses } from './domain-addresses'
import {
    DomainModel,
    type CreateDomainData,
    type DomainData,
    type UpdateDomainData
} from './domains.model'

export interface ListDomainsParams extends ListParams {
    /**
     * Search domains by name.
     */
    search?: string
}

/**
 * Domain API resource.
 */
export class Domains extends ListableResource<DomainData, DomainModel, UpdateDomainData, ListDomainsParams> {
    /**
     * API path segment for domains.
     */
    override endpoint = 'domains'

    /**
     * Model class returned by domain operations.
     */
    override model = DomainModel

    /**
     * Create a domain.
     *
     * @param data - Domain creation payload.
     */
    async create(data: CreateDomainData): Promise<DomainModel> {
        const payload = await this.postResource<ResourceResponse<DomainData>>(undefined, data)

        return this.makeModel(payload.data)
    }

    /**
     * Get a domain by uuid.
     *
     * @param uuid - Domain uuid.
     */
    async get(uuid: string): Promise<DomainModel> {
        const payload = await this.getResource<ResourceResponse<DomainData>>([uuid])

        return this.makeModel(payload.data)
    }

    /**
     * Delete a domain by uuid.
     *
     * @param uuid - Domain uuid.
     */
    async delete(uuid: string): Promise<void> {
        await this.deleteResource<void>([uuid])
    }

    /**
     * Refresh domain verification status.
     *
     * @param uuid - Domain uuid.
     */
    async verify(uuid: string): Promise<DomainModel> {
        const payload = await this.postResource<ResourceResponse<DomainData>>([uuid, 'verification'])

        return this.makeModel(payload.data)
    }

    /**
     * Access address API operations for a domain.
     *
     * @param uuid - Domain uuid.
     */
    addresses(uuid: string): DomainAddresses {
        return new DomainAddresses(this.client, uuid)
    }
}
