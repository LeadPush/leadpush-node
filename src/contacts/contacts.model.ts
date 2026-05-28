import { Model } from '../model'
import { ContactEvents } from './contact-events'

export type AttributeValue = string | number | boolean | null

export type Attributes = Record<string, AttributeValue>

/**
 * Raw contact data returned by the API.
 */
export interface ContactData<TAttributes extends Attributes = Attributes> {
    uuid: string
    subscribed: boolean
    attributes: TAttributes
    provider: string | null
    updated_at: string
    created_at: string
}

/**
 * Payload accepted by contact creation.
 */
export interface CreateContactData<TAttributes extends Attributes = Attributes> {
    attributes: TAttributes
    subscribed?: boolean
}

/**
 * Payload accepted by contact updates.
 */
export interface UpdateContactData<TAttributes extends Attributes = Attributes> {
    attributes?: Partial<TAttributes>
    subscribed?: boolean
}

interface ContactResponse {
    data: ContactData
}

/**
 * Contact returned by the Leadpush API.
 */
export class ContactModel extends Model<ContactData, UpdateContactData, ContactModel> {
    /**
     * Contact id.
     */
    get uuid(): string {
        return this.data.uuid
    }

    /**
     * Whether the contact is currently subscribed.
     */
    get subscribed(): boolean {
        return this.data.subscribed
    }

    /**
     * Update the local subscribed value and mark it dirty for `update()`.
     */
    set subscribed(value: boolean) {
        this.data.subscribed = value
        this.setDirty('subscribed', value)
    }

    /**
     * Contact attributes returned by the API.
     */
    get attributes(): ContactData['attributes'] {
        return this.data.attributes
    }

    /**
     * Update one contact attribute and mark it dirty for `update()`.
     *
     * @param key - Attribute key.
     * @param value - Attribute value.
     */
    setAttribute(key: string, value: AttributeValue): void {
        this.data.attributes[key] = value
        this.setDirty('attributes', {
            ...this.getDirty().attributes,
            [key]: value
        })
    }

    /**
     * Contact creation date.
     */
    get createdAt(): Date {
        return new Date(this.data.created_at)
    }

    /**
     * Contact last update date.
     */
    get updatedAt(): Date {
        return new Date(this.data.updated_at)
    }

    /**
     * Persist dirty local changes to the API.
     */
    async update(): Promise<this> {
        if (!this.isDirty()) {
            return this
        }

        const updated = await this.requireContext().update(this.uuid, this.getDirty())

        this.replaceData(updated.toJSON())
        this.clearDirty()

        return this
    }

    /**
     * Subscribe the contact.
     */
    async subscribe(): Promise<this> {
        const payload = await this.post<ContactResponse>([this.uuid, 'subscribe'])

        this.replaceData(payload.data)
        this.clearDirty()

        return this
    }

    /**
     * Unsubscribe the contact.
     */
    async unsubscribe(): Promise<this> {
        const payload = await this.post<ContactResponse>([this.uuid, 'unsubscribe'])

        this.replaceData(payload.data)
        this.clearDirty()

        return this
    }

    /**
     * Access event API operations for this contact.
     */
    events(): ContactEvents {
        return new ContactEvents(this.requireContext().client, this.uuid)
    }
}
