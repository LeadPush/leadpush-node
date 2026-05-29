import { ListableResource, type ListParams } from '../entity'
import type { Leadpush } from '../leadpush'
import {
    ContactEventModel,
    type ContactEventData,
    type CreateContactEventData,
    type UpdateContactEventData
} from './contact-events.model'

export interface ListContactEventsParams extends ListParams {
    /**
     * Search contact events by event name.
     */
    search?: string
}

interface CreateContactEventRequest {
    event_name: string
    attributes?: string
}

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

    /**
     * Create a contact event.
     *
     * @param data - Contact event creation payload.
     */
    async create(data: CreateContactEventData): Promise<void> {
        await this.postResource<void>(undefined, this.serializeCreateData(data))
    }

    private serializeCreateData(data: CreateContactEventData): CreateContactEventRequest {
        const request: CreateContactEventRequest = {
            event_name: data.event_name
        }

        if (data.attributes !== undefined) {
            request.attributes = JSON.stringify(data.attributes)
        }

        return request
    }
}
