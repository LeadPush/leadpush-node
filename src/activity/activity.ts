import type { PaginatedResponse } from '../entity'
import type { Leadpush } from '../leadpush'
import type { ActivityData, ActivityListParams } from './activity.model'

export class Activity {
    constructor(private readonly client: Leadpush) {}

    async list(params: ActivityListParams = {}): Promise<PaginatedResponse<ActivityData>> {
        return await this.client.get('activity', {
            event_types: params.eventTypes,
            search: params.search,
            since: params.since,
            page: params.page,
            per_page: params.perPage
        })
    }
}
