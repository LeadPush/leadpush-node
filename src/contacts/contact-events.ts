import { ListableResource, type ListParams } from '../entity'
import type { Leadpush } from '../leadpush'
import { ContactEventModel, type ContactEventData, type UpdateContactEventData } from './contact-events.model'

export type ListContactEventsParams = ListParams

/**
 * Contact events API resource.
 */
export class ContactEvents extends ListableResource<
    ContactEventData,
    ContactEventModel,
    UpdateContactEventData,
    ListContactEventsParams
> {
    /**
     * API path for contact events.
     */
    override endpoint: readonly string[]

    /**
     * Model class returned by contact event operations.
     */
    override model = ContactEventModel

    /**
     * Create a contact events resource handler.
     *
     * @param client - Leadpush API client.
     * @param contactId - Contact id.
     */
    constructor(client: Leadpush, readonly contactId: string) {
        super(client)

        this.endpoint = ['contacts', contactId, 'events']
    }
}
