import { afterEach, describe, expect, it, vi } from 'vitest'

import { ContactModel } from './contacts.model'
import {
    contactData,
    createContactData,
    unsubscribedContactData,
    updatedContactData,
    updateContactData
} from '../test-support/fixtures'
import { createClient, expectedHeaders, mockJsonResponse, mockJsonResponses, testBaseUrl } from '../test-support/http'

describe('Contacts', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('gets a contact by uuid', async () => {
        const fetchMock = mockJsonResponse({
            data: contactData
        })

        const contact = await createClient().contacts().get(contactData.uuid)

        expect(contact).toBeInstanceOf(ContactModel)
        expect(contact.uuid).toBe(contactData.uuid)
        expect(contact.attributes.email).toBe(contactData.attributes.email)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts/69474ed13511f060ca09781a`, {
            headers: expectedHeaders()
        })
    })

    it('creates a contact', async () => {
        const fetchMock = mockJsonResponse({
            data: contactData
        })

        const contact = await createClient().contacts().create(createContactData)

        expect(contact).toBeInstanceOf(ContactModel)
        expect(contact.uuid).toBe(contactData.uuid)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(createContactData)
        })
    })

    it('updates a contact by uuid', async () => {
        const fetchMock = mockJsonResponse({
            data: updatedContactData
        })

        const contact = await createClient().contacts().update(contactData.uuid, updateContactData)

        expect(contact).toBeInstanceOf(ContactModel)
        expect(contact.uuid).toBe(contactData.uuid)
        expect(contact.attributes.first_name).toBe('Updated')
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts/69474ed13511f060ca09781a`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(updateContactData)
        })
    })

    it('updates an attached contact model', async () => {
        const fetchMock = mockJsonResponses(
            {
                payload: {
                    data: contactData
                }
            },
            {
                payload: {
                    data: unsubscribedContactData
                }
            }
        )
        const contact = await createClient().contacts().get(contactData.uuid)

        contact.subscribed = false

        const updated = await contact.update()

        expect(updated).toBe(contact)
        expect(contact.subscribed).toBe(false)
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${testBaseUrl}/contacts/69474ed13511f060ca09781a`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                subscribed: false
            })
        })
    })

    it('subscribes an attached contact model', async () => {
        const fetchMock = mockJsonResponses(
            {
                payload: {
                    data: unsubscribedContactData
                }
            },
            {
                payload: {
                    data: contactData
                }
            }
        )
        const contact = await createClient().contacts().get(contactData.uuid)

        expect(contact.subscribed).toBe(false)

        const subscribed = await contact.subscribe()

        expect(subscribed).toBe(contact)
        expect(contact.subscribed).toBe(true)
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${testBaseUrl}/contacts/69474ed13511f060ca09781a/subscribe`, {
            method: 'POST',
            headers: expectedHeaders()
        })
    })

    it('unsubscribes an attached contact model', async () => {
        const fetchMock = mockJsonResponses(
            {
                payload: {
                    data: contactData
                }
            },
            {
                payload: {
                    data: unsubscribedContactData
                }
            }
        )
        const contact = await createClient().contacts().get(contactData.uuid)

        expect(contact.subscribed).toBe(true)

        const unsubscribed = await contact.unsubscribe()

        expect(unsubscribed).toBe(contact)
        expect(contact.subscribed).toBe(false)
        expect(fetchMock).toHaveBeenNthCalledWith(2, `${testBaseUrl}/contacts/69474ed13511f060ca09781a/unsubscribe`, {
            method: 'POST',
            headers: expectedHeaders()
        })
    })

    it('lists contacts from a paginated response', async () => {
        const fetchMock = mockJsonResponse({
            data: [contactData],
            meta: {
                current_page: 2,
                per_page: 1,
                total: 88,
                last_page: 88,
                has_next: true
            }
        })
        const contacts = await createClient().contacts().list({
            page: 2,
            per_page: 1
        })

        expect(contacts.data[0]).toBeInstanceOf(ContactModel)
        expect(contacts.data[0]?.uuid).toBe(contactData.uuid)
        expect(contacts.meta.total).toBe(88)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts?page=2&per_page=1`, {
            headers: expectedHeaders()
        })
    })
})
