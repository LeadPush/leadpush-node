import { Entity } from '../entity'
import { ContactEvents } from './contact-events'
import {
    ContactModel,
    type ContactData,
    type ContactIdentifier,
    type CreateContactData,
    type UpdateContactData
} from './contacts.model'

interface ContactResponse {
    data: ContactData
}

/**
 * Contact API resource.
 */
export class Contacts extends Entity<ContactData, ContactModel, CreateContactData, UpdateContactData> {
    /**
     * API path segment for contacts.
     */
    override endpoint = 'contacts'

    /**
     * Model class returned by contact operations.
     */
    override model = ContactModel

    /**
     * Get a contact by uuid or workspace identity value.
     *
     * @param identifier - Contact uuid or workspace identity value.
     */
    override async get(identifier: ContactIdentifier): Promise<ContactModel> {
        return await super.get(identifier)
    }

    /**
     * Update a contact by uuid or workspace identity value.
     *
     * @param identifier - Contact uuid or workspace identity value.
     * @param data - Contact update payload.
     */
    override async update(identifier: ContactIdentifier, data: UpdateContactData): Promise<ContactModel> {
        return await super.update(identifier, data)
    }

    /**
     * Subscribe a contact by uuid or workspace identity value.
     *
     * @param identifier - Contact uuid or workspace identity value.
     */
    async subscribe(identifier: ContactIdentifier): Promise<ContactModel> {
        const payload = await this.postResource<ContactResponse>([identifier, 'subscribe'])

        return this.makeModel(payload.data)
    }

    /**
     * Unsubscribe a contact by uuid or workspace identity value.
     *
     * @param identifier - Contact uuid or workspace identity value.
     */
    async unsubscribe(identifier: ContactIdentifier): Promise<ContactModel> {
        const payload = await this.postResource<ContactResponse>([identifier, 'unsubscribe'])

        return this.makeModel(payload.data)
    }

    /**
     * Access event API operations for a contact by uuid or workspace identity value.
     *
     * @param identifier - Contact uuid or workspace identity value.
     */
    events(identifier: ContactIdentifier): ContactEvents {
        return new ContactEvents(this.client, identifier)
    }
}
