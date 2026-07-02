import { Model } from '../model'
import { DomainAddresses } from './domain-addresses'

export type DomainProvider = 'aws' | 'leadpush'

export type DomainStatus = 'pending'

export type DomainVerification = 'pending' | 'completed' | 'failed'

export type DomainTrackingMode = 'direct' | 'cloudflare'

export interface DomainDnsRecord {
    type: string
    name: string
    value: string
    is_valid: boolean
}

/**
 * Raw domain data returned by the API.
 */
export interface DomainData {
    uuid: string
    name: string
    domain: string
    verified: boolean
    provider: DomainProvider
    status: DomainStatus
    verification: DomainVerification
    mail_from_domain: string
    mail_from_verified: boolean
    dns: DomainDnsRecord[]
    updated_at: string
    created_at: string
}

/**
 * Payload accepted by domain creation.
 */
export interface CreateDomainData {
    name: string
    dkim_selectors?: string[] | null
    tracking_subdomain?: string | null
    tracking_mode?: DomainTrackingMode | null
}

export type UpdateDomainData = Record<string, never>

interface DomainResponse {
    data: DomainData
}

/**
 * Domain returned by the Leadpush API.
 */
export class DomainModel extends Model<DomainData, UpdateDomainData, DomainModel> {
    /**
     * Domain id.
     */
    get uuid(): string {
        return this.data.uuid
    }

    /**
     * Domain name.
     */
    get name(): string {
        return this.data.name
    }

    /**
     * Domain name.
     */
    get domain(): string {
        return this.data.domain
    }

    /**
     * Whether the domain is verified.
     */
    get verified(): boolean {
        return this.data.verified
    }

    /**
     * Domain provider.
     */
    get provider(): DomainProvider {
        return this.data.provider
    }

    /**
     * Domain lifecycle status.
     */
    get status(): DomainStatus {
        return this.data.status
    }

    /**
     * Domain verification status.
     */
    get verification(): DomainVerification {
        return this.data.verification
    }

    /**
     * Custom MAIL FROM domain.
     */
    get mailFromDomain(): string {
        return this.data.mail_from_domain
    }

    /**
     * Whether the custom MAIL FROM domain is verified.
     */
    get mailFromVerified(): boolean {
        return this.data.mail_from_verified
    }

    /**
     * DNS records required for verification.
     */
    get dns(): DomainDnsRecord[] {
        return this.data.dns
    }

    /**
     * Domain creation date.
     */
    get createdAt(): Date {
        return new Date(this.data.created_at)
    }

    /**
     * Domain last update date.
     */
    get updatedAt(): Date {
        return new Date(this.data.updated_at)
    }

    /**
     * Refresh domain verification status.
     */
    async verify(): Promise<this> {
        const payload = await this.post<DomainResponse>([this.uuid, 'verification'])

        this.replaceData(payload.data)
        this.clearDirty()

        return this
    }

    /**
     * Delete this domain.
     */
    async delete(): Promise<void> {
        await this.requestDelete([this.uuid])
    }

    /**
     * Access address API operations for this domain.
     */
    addresses(): DomainAddresses {
        return new DomainAddresses(this.requireContext().client, this.uuid)
    }
}
