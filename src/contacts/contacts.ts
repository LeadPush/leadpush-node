import { Entity } from '../entity'
import { ContactEvents } from './contact-events'
import { ContactModel, type ContactData, type CreateContactData, type UpdateContactData } from './contacts.model'

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
     * Access event API operations for a contact.
     *
     * @param contactId - Contact id.
     */
    events(contactId: string): ContactEvents {
        return new ContactEvents(this.client, contactId)
    }
}
