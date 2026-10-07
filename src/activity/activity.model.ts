export interface ActivityListParams {
    eventTypes?: string[]
    search?: string
    since?: string
    page?: number
    perPage?: number
}

export interface ActivityData {
    uuid: string
    event_type: string
    event_name: string | null
    subject: { type: string, uuid: string | null, name: string | null, deleted: boolean }
    created_at: string | null
}
