import { Model } from '../model'

export type SuppressionType = 'bounce' | 'complaint' | 'manual'

/**
 * Raw suppression data returned by the API.
 */
export interface SuppressionData {
    uuid: string
    email: string
    type: SuppressionType
    created_at: string
}

/**
 * Payload accepted by suppression creation.
 */
export interface CreateSuppressionData {
    email: string
    type?: SuppressionType
}

export type UpdateSuppressionData = Partial<CreateSuppressionData>

/**
 * Filter suppressions by suppression type.
 */
export interface SuppressionTypeFilter {
    id: 'type'
    value: SuppressionType[]
}

export type SuppressionFilter = SuppressionTypeFilter

/**
 * Suppression returned by the Leadpush API.
 */
export class SuppressionModel extends Model<SuppressionData, UpdateSuppressionData, SuppressionModel> {
    /**
     * Suppression id.
     */
    get uuid(): string {
        return this.data.uuid
    }

    /**
     * Suppressed email address.
     */
    get email(): string {
        return this.data.email
    }

    /**
     * Suppression type.
     */
    get type(): SuppressionType {
        return this.data.type
    }

    /**
     * Suppression creation date.
     */
    get createdAt(): Date {
        return new Date(this.data.created_at)
    }
}
