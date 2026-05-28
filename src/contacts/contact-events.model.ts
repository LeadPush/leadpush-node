import { Model } from '../model'

export type ContactEventData = Record<string, unknown>

export type UpdateContactEventData = Record<string, never>

/**
 * Contact event returned by the Leadpush API.
 */
export class ContactEventModel extends Model<ContactEventData, UpdateContactEventData, ContactEventModel> {
    /**
     * Event id, when present in the API response.
     */
    get uuid(): string | undefined {
        return this.getString('uuid')
    }

    /**
     * Event type, when present in the API response.
     */
    get type(): string | undefined {
        return this.getString('type')
    }

    /**
     * Event creation date, when present in the API response.
     */
    get createdAt(): Date | undefined {
        const value = this.data.created_at

        if (typeof value !== 'string') {
            return undefined
        }

        return new Date(value)
    }

    private getString(key: string): string | undefined {
        const value = this.data[key]

        if (typeof value !== 'string') {
            return undefined
        }

        return value
    }
}
