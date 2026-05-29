import { afterEach, describe, expect, it, vi } from 'vitest'

import { ContactEventModel } from './contact-events.model'
import { contactData, contactEventData, createContactEventData } from '../test-support/fixtures'
import { createClient, expectedHeaders, mockJsonResponse, mockJsonResponses, testBaseUrl } from '../test-support/http'

describe('Contact events', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('lists contact events from the contacts resource', async () => {
        const fetchMock = mockJsonResponse({
            data: [contactEventData],
            meta: {
                current_page: 2,
                per_page: 1,
                total: 3,
                last_page: 3,
                has_next: true
            }
        })
        const events = await createClient().contacts().events(contactData.uuid).list({
            page: 2,
            per_page: 1,
            search: 'purchase'
        })

        expect(events.data[0]).toBeInstanceOf(ContactEventModel)
        expect(events.data[0]?.uuid).toBe(contactEventData.uuid)
        expect(events.data[0]?.eventName).toBe(contactEventData.event_name)
        expect(events.data[0]?.type).toBe(contactEventData.event_name)
        expect(events.data[0]?.attributes).toEqual(contactEventData.attributes)
        expect(events.data[0]?.createdAt).toEqual(new Date(contactEventData.created_at))
        expect(events.data[0]?.toJSON()).toEqual(contactEventData)
        expect(events.meta.total).toBe(3)
        expect(fetchMock).toHaveBeenCalledWith(
            `${testBaseUrl}/contacts/${contactData.uuid}/events?page=2&per_page=1&search=purchase`,
            {
                headers: expectedHeaders()
            }
        )
    })

    it('lists contact events from an attached contact model', async () => {
        const fetchMock = mockJsonResponses(
            {
                payload: {
                    data: contactData
                }
            },
            {
                payload: {
                    data: [contactEventData],
                    meta: {
                        current_page: 1,
                        per_page: 10,
                        total: 1,
                        last_page: 1,
                        has_next: false
                    }
                }
            }
        )
        const contact = await createClient().contacts().get(contactData.uuid)
        const events = await contact.events().list()

        expect(events.data[0]).toBeInstanceOf(ContactEventModel)
        expect(events.data[0]?.uuid).toBe(contactEventData.uuid)
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            `${testBaseUrl}/contacts/${contactData.uuid}/events`,
            {
                headers: expectedHeaders()
            }
        )
    })

    it('creates contact events', async () => {
        const fetchMock = mockJsonResponse({
            data: contactEventData
        })
        const event = await createClient().contacts().events(contactData.uuid).create(createContactEventData)

        expect(event).toBeInstanceOf(ContactEventModel)
        expect(event.uuid).toBe(contactEventData.uuid)
        expect(event.eventName).toBe(contactEventData.event_name)
        expect(event.attributes).toEqual(contactEventData.attributes)
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts/${contactData.uuid}/events`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                event_name: createContactEventData.event_name,
                attributes: JSON.stringify(createContactEventData.attributes)
            })
        })
    })

    it('creates contact events without attributes', async () => {
        const fetchMock = mockJsonResponse({
            data: {
                ...contactEventData,
                attributes: null
            }
        })
        const event = await createClient().contacts().events(contactData.uuid).create({
            event_name: 'test'
        })

        expect(event.attributes).toBeNull()
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/contacts/${contactData.uuid}/events`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                event_name: 'test'
            })
        })
    })
})
