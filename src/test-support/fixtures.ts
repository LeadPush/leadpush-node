import type {
    ContactData,
    CreateContactData,
    UpdateContactData
} from '../contacts/contacts.model'
import type { ContactEventData } from '../contacts/contact-events.model'
import type { CreateFieldData, FieldData, FieldFilter } from '../fields/fields.model'
import type { SuppressionData, SuppressionFilter } from '../suppressions/suppressions.model'

export const contactData = {
    uuid: '69474ed13511f060ca09781a',
    subscribed: true,
    attributes: {
        email: 'contact@example.com',
        phone: '5551234567',
        first_name: 'John',
        last_name: 'Doe',
        mailchimp: null,
        test_date: null,
        test_number: 2342
    },
    provider: 'gmail',
    updated_at: '2026-03-27T16:50:43.106000Z',
    created_at: '2025-12-21T01:35:13.531000Z'
} satisfies ContactData

export const updatedContactData = {
    ...contactData,
    attributes: {
        ...contactData.attributes,
        first_name: 'Updated'
    }
} satisfies ContactData

export const unsubscribedContactData = {
    ...contactData,
    subscribed: false
} satisfies ContactData

export const createContactData = {
    subscribed: true,
    attributes: {
        email: 'created@example.com',
        phone: null,
        first_name: 'Created',
        last_name: 'Contact'
    }
} satisfies CreateContactData

export const updateContactData = {
    attributes: {
        first_name: 'Updated'
    }
} satisfies UpdateContactData

export const contactEventData = {
    uuid: 'event-id',
    type: 'opened',
    created_at: '2026-05-27T02:37:41.000000Z',
    message: {
        uuid: 'message-id'
    }
} satisfies ContactEventData

export const fieldData = {
    uuid: 'field-uuid',
    name: 'company_name',
    type: 'text',
    format: {
        text: 'url',
        pattern: null,
        iso_format: null
    },
    created_at: '2021-01-01T00:00:00.000Z'
} satisfies FieldData

export const createFieldData = {
    name: 'company_name',
    type: 'text',
    format: {
        text: 'url'
    }
} satisfies CreateFieldData

export const fieldFilters = [
    {
        id: 'type',
        value: ['text']
    }
] satisfies FieldFilter[]

export const suppressionData = {
    uuid: 'suppression-id',
    email: 'blocked@example.test',
    type: 'manual',
    created_at: '2021-01-01T00:00:00.000Z'
} satisfies SuppressionData

export const suppressionFilters = [
    {
        id: 'type',
        value: ['bounce']
    }
] satisfies SuppressionFilter[]
