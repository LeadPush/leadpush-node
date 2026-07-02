import { Resource, type ResourceResponse } from '../entity'
import {
    EmailSendModel,
    type EmailSendData,
    type SendEmailData,
    type UpdateEmailSendData
} from './emails.model'

/**
 * Email sending API resource.
 */
export class Emails extends Resource<
    EmailSendData,
    EmailSendModel,
    UpdateEmailSendData
> {
    /**
     * API path segment for email sends.
     */
    override endpoint = 'emails'

    /**
     * Model class returned by email send operations.
     */
    override model = EmailSendModel

    /**
     * Queue an email for delivery.
     *
     * @param data - Email send payload.
     */
    async send(data: SendEmailData): Promise<EmailSendModel> {
        const payload = await this.postResource<ResourceResponse<EmailSendData>>(undefined, data)

        return this.makeModel(payload.data)
    }
}
