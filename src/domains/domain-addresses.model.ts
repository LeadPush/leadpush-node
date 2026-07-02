import { Model } from '../model'
import type { DomainProvider, DomainVerification } from './domains.model'

/**
 * Raw domain address data returned by the API.
 */
export interface DomainAddressData {
    uuid: string
    domain_uuid: string
    address: string
    full_address: string
    provider: DomainProvider | null
    display_name: string
    verification: DomainVerification
    updated_at: string
    created_at: string
}

/**
 * Payload accepted by domain address creation.
 */
export interface CreateDomainAddressData {
    address: string
    display_name: string
    reply_to: string
    company_address: string
    company_address_2?: string | null
    company_city: string
    company_state: string
    company_zip: string
    company_country: string
}

export type UpdateDomainAddressData = Record<string, never>

/**
 * Domain address returned by the Leadpush API.
 */
export class DomainAddressModel extends Model<
    DomainAddressData,
    UpdateDomainAddressData,
    DomainAddressModel
> {
    /**
     * Domain address id.
     */
    get uuid(): string {
        return this.data.uuid
    }

    /**
     * Parent domain id.
     */
    get domainUuid(): string {
        return this.data.domain_uuid
    }

    /**
     * Address local part.
     */
    get address(): string {
        return this.data.address
    }

    /**
     * Full email address.
     */
    get fullAddress(): string {
        return this.data.full_address
    }

    /**
     * Domain provider.
     */
    get provider(): DomainAddressData['provider'] {
        return this.data.provider
    }

    /**
     * Sender display name.
     */
    get displayName(): string {
        return this.data.display_name
    }

    /**
     * Address verification status.
     */
    get verification(): DomainVerification {
        return this.data.verification
    }

    /**
     * Address creation date.
     */
    get createdAt(): Date {
        return new Date(this.data.created_at)
    }

    /**
     * Address last update date.
     */
    get updatedAt(): Date {
        return new Date(this.data.updated_at)
    }

    /**
     * Delete this domain address.
     */
    async delete(): Promise<void> {
        await this.requestDelete([this.uuid])
    }
}
