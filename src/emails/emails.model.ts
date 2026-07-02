import { Model } from '../model'

export type EmailRecipientType = 'to' | 'bcc'

/**
 * Raw per-recipient message data returned by the API.
 */
export interface EmailSendMessageData {
    uuid: string
    recipient: string
    type: EmailRecipientType
    from: string
    status: string
}

/**
 * Raw send response data returned by the API.
 */
export interface EmailSendData {
    accepted: boolean
    message_count: number
    messages: EmailSendMessageData[]
}

/**
 * Payload accepted by the email sending endpoint.
 */
export interface SendEmailData {
    from: string
    subject: string
    html?: string
    text?: string
    to?: string[]
    bcc?: string[]
    reply_to?: string
    headers?: Record<string, string>
}

export type UpdateEmailSendData = Record<string, never>

/**
 * Accepted email send returned by the Leadpush API.
 */
export class EmailSendModel extends Model<EmailSendData, UpdateEmailSendData, EmailSendModel> {
    /**
     * Whether the email send was accepted for delivery.
     */
    get accepted(): boolean {
        return this.data.accepted
    }

    /**
     * Number of per-recipient messages created.
     */
    get messageCount(): number {
        return this.data.message_count
    }

    /**
     * Per-recipient messages created for this send.
     */
    get messages(): EmailSendMessageData[] {
        return this.data.messages
    }
}
