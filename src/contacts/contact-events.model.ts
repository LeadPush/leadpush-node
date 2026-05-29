import { Model } from '../model'

export type ContactEventAttributes = Record<string, unknown>

/**
 * Raw contact event data returned by the API.
 */
export interface ContactEventData {
    uuid: string
    event_name: string
    attributes: ContactEventAttributes | null
    created_at: string
}

/**
 * Payload accepted by contact event creation.
 */
export interface CreateContactEventData {
    event_name: string
    attributes?: ContactEventAttributes
}

export type UpdateContactEventData = Record<string, never>

/**
 * Contact event returned by the Leadpush API.
 */
export class ContactEventModel extends Model<ContactEventData, UpdateContactEventData, ContactEventModel> {
    /**
     * Event id.
     */
    get uuid(): string {
        return this.data.uuid
    }

    /**
     * Event name.
     */
    get eventName(): string {
        return this.data.event_name
    }

    /**
     * Event name.
     *
     * @deprecated Use `eventName`.
     */
    get type(): string {
        return this.eventName
    }

    /**
     * Event attributes.
     */
    get attributes(): ContactEventData['attributes'] {
        return this.data.attributes
    }

    /**
     * Event creation date.
     */
    get createdAt(): Date {
        return new Date(this.data.created_at)
    }
}
