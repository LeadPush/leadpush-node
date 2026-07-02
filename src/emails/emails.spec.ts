import { afterEach, describe, expect, it, vi } from 'vitest'

import { EmailSendModel } from './emails.model'
import { createEmailData, emailSendData } from '../test-support/fixtures'
import { createClient, expectedHeaders, mockJsonResponse, testBaseUrl } from '../test-support/http'

describe('Emails', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('sends an email', async () => {
        const fetchMock = mockJsonResponse({
            data: emailSendData
        }, {
            status: 202
        })

        const send = await createClient().emails().send(createEmailData)

        expect(send).toBeInstanceOf(EmailSendModel)
        expect(send.accepted).toBe(true)
        expect(send.messageCount).toBe(4)
        expect(send.messages[0]?.uuid).toBe(emailSendData.messages[0]?.uuid)
        expect(send.messages[0]?.recipient).toBe('known@example.test')
        expect(send.messages[0]?.type).toBe('to')
        expect(send.messages[3]?.type).toBe('bcc')
        expect(fetchMock).toHaveBeenCalledWith(`${testBaseUrl}/emails`, {
            method: 'POST',
            headers: expectedHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(createEmailData)
        })
    })
})
