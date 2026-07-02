import type {
    ContactData,
    CreateContactData,
    UpdateContactData
} from '../contacts/contacts.model'
import type { ContactEventData, CreateContactEventData } from '../contacts/contact-events.model'
import type { CreateFieldData, FieldData, FieldFilter } from '../fields/fields.model'
import type {
    CreateDomainAddressData,
    DomainAddressData
} from '../domains/domain-addresses.model'
import type { CreateDomainData, DomainData } from '../domains/domains.model'
import type { EmailSendData, SendEmailData } from '../emails/emails.model'
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
    uuid: '6a19c3c2673f43e71a0f3882',
    event_name: 'purchase',
    attributes: {
        plan: 'enterprise'
    },
    created_at: '2026-05-29T16:50:10.000000Z'
} satisfies ContactEventData

export const createContactEventData = {
    event_name: 'purchase',
    attributes: {
        plan: 'enterprise'
    }
} satisfies CreateContactEventData

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

export const domainData = {
    uuid: 'domain-uuid',
    name: 'example.test',
    domain: 'example.test',
    verified: false,
    provider: 'leadpush',
    status: 'pending',
    verification: 'pending',
    mail_from_domain: 'bounces.example.test',
    mail_from_verified: false,
    dns: [
        {
            type: 'CNAME',
            name: 'default._domainkey.example.test',
            value: 'default._domainkey.smtp-domain-1.leadpush.net.',
            is_valid: false
        },
        {
            type: 'MX',
            name: 'bounces.example.test',
            value: '10 bounces.leadpush.net',
            is_valid: false
        }
    ],
    updated_at: '2026-06-20T12:00:00.000Z',
    created_at: '2026-06-20T12:00:00.000Z'
} satisfies DomainData

export const verifiedDomainData = {
    ...domainData,
    verified: true,
    verification: 'completed',
    mail_from_verified: true,
    dns: domainData.dns.map((record) => ({
        ...record,
        is_valid: true
    })),
    updated_at: '2026-06-20T12:05:00.000Z'
} satisfies DomainData

export const createDomainData = {
    name: 'example.test',
    dkim_selectors: ['default'],
    tracking_subdomain: 'click',
    tracking_mode: 'cloudflare'
} satisfies CreateDomainData

export const domainAddressData = {
    uuid: 'address-uuid',
    domain_uuid: domainData.uuid,
    address: 'sender',
    full_address: 'sender@example.test',
    provider: 'leadpush',
    display_name: 'Sender Name',
    verification: 'completed',
    updated_at: '2026-06-20T12:10:00.000Z',
    created_at: '2026-06-20T12:10:00.000Z'
} satisfies DomainAddressData

export const createDomainAddressData = {
    address: 'sender',
    display_name: 'Sender Name',
    reply_to: 'reply@example.test',
    company_address: '123 Main St',
    company_address_2: null,
    company_city: 'New York',
    company_state: 'NY',
    company_zip: '10001',
    company_country: 'US'
} satisfies CreateDomainAddressData

export const createEmailData = {
    from: 'sender@developer.test',
    subject: 'Developer API email',
    html: '<p>Hello world</p>',
    text: 'Hello world',
    to: [
        'known@example.test',
        'other@example.test',
        'third@example.test'
    ],
    bcc: [
        'audit@example.test'
    ],
    reply_to: 'reply@example.test',
    headers: {
        'X-Correlation-ID': 'abc-123',
        'Auto-Submitted': 'auto-generated'
    }
} satisfies SendEmailData

export const emailSendData = {
    accepted: true,
    message_count: 4,
    messages: [
        {
            uuid: 'message-known-uuid',
            recipient: 'known@example.test',
            type: 'to',
            from: 'sender@developer.test',
            status: 'pending'
        },
        {
            uuid: 'message-other-uuid',
            recipient: 'other@example.test',
            type: 'to',
            from: 'sender@developer.test',
            status: 'pending'
        },
        {
            uuid: 'message-third-uuid',
            recipient: 'third@example.test',
            type: 'to',
            from: 'sender@developer.test',
            status: 'pending'
        },
        {
            uuid: 'message-audit-uuid',
            recipient: 'audit@example.test',
            type: 'bcc',
            from: 'sender@developer.test',
            status: 'pending'
        }
    ]
} satisfies EmailSendData

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
