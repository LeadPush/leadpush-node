import type { PaginatedResponse } from '../entity'
import type { Leadpush } from '../leadpush'
import type { DateRange } from '../metrics/metrics.model'
import type {
    CampaignData,
    CampaignDetails,
    CampaignExecutionInspection,
    CampaignListParams,
    CampaignMetrics
} from './campaigns.model'

function pagination(params: { page?: number, perPage?: number }): Record<string, number | undefined> {
    return { page: params.page, per_page: params.perPage }
}

export class CampaignExecutions {
    constructor(private readonly client: Leadpush, private readonly campaignId: string) {}

    async get(executionId: string, stepLimit?: number): Promise<CampaignExecutionInspection> {
        return (await this.client.get<{ data: CampaignExecutionInspection }>(
            ['campaigns', this.campaignId, 'executions', executionId],
            { step_limit: stepLimit }
        )).data
    }
}

export class Campaigns {
    constructor(private readonly client: Leadpush) {}

    async list(params: CampaignListParams = {}): Promise<PaginatedResponse<CampaignData>> {
        return await this.client.get('campaigns', {
            search: params.search,
            statuses: params.statuses,
            ...pagination(params)
        })
    }

    async get(campaignId: string): Promise<CampaignDetails> {
        return (await this.client.get<{ data: CampaignDetails }>(['campaigns', campaignId])).data
    }

    async metrics(campaignId: string, range: DateRange): Promise<CampaignMetrics> {
        return (await this.client.get<{ data: CampaignMetrics }>(['campaigns', campaignId, 'metrics'], {
            start: range.start,
            end: range.end,
            unit: range.unit
        })).data
    }

    executions(campaignId: string): CampaignExecutions {
        return new CampaignExecutions(this.client, campaignId)
    }
}
