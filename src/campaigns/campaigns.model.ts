import type { MetricReport } from '../metrics/metrics.model'

export interface CampaignData {
    uuid: string
    name: string
    description: string | null
    status: 'draft' | 'running'
    tags: string[]
    active_version_uuid: string | null
    display_version_number: number | null
    has_unpublished_changes: boolean
    created_at: string | null
    updated_at: string | null
}

export interface CampaignDetails extends CampaignData {
    draft_version_uuid: string | null
    active_execution_count: number
}

export interface CampaignListParams {
    search?: string
    statuses?: Array<'draft' | 'running'>
    page?: number
    perPage?: number
}

export type CampaignMetrics = MetricReport

export interface CampaignExecutionInspection {
    execution: {
        uuid: string
        status: string
        campaign_uuid: string
        campaign_version_uuid: string | null
        campaign_version_number: number | null
        started_at: string | null
        completed_at: string | null
        last_step_at: string | null
        current_or_failed_node_id: number | null
    }
    contact: { uuid: string, email: string | null, first_name: string | null, last_name: string | null } | null
    recent_steps: Array<{
        uuid: string
        node_id: number | null
        output_handle: string | null
        entered_at: string | null
        exited_at: string | null
        failed: boolean
        completed: boolean
    }>
    error: { category: string, message: string } | null
}
