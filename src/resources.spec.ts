import { afterEach, describe, expect, it, vi } from 'vitest'

import { createClient, mockJsonResponses, testBaseUrl } from './test-support/http'

const campaign = {
    uuid: 'campaign-1',
    name: 'Welcome',
    description: null,
    status: 'draft' as const,
    tags: [],
    active_version_uuid: null,
    display_version_number: null,
    has_unpublished_changes: false,
    created_at: null,
    updated_at: null
}

describe('resource-oriented reads', () => {
    afterEach(() => vi.unstubAllGlobals())

    it('uses resource-oriented workspace, campaign, metrics, activity, and execution endpoints', async () => {
        const fetchMock = mockJsonResponses(
            { payload: { data: { workspace: { uuid: 'workspace-1', name: 'Test', state: 'active' }, role: 'owner', counts: {}, sending: {} } } },
            { payload: { data: [campaign], meta: { current_page: 1, per_page: 20, total: 1, last_page: 1, has_next: false } } },
            { payload: { data: { ...campaign, draft_version_uuid: null, active_execution_count: 0 } } },
            { payload: { data: { range: {}, summary: {}, series: [] } } },
            { payload: { data: { range: {}, summary: {}, series: [] } } },
            { payload: { data: [], meta: { current_page: 1, per_page: 20, total: 0, last_page: 1, has_next: false } } },
            { payload: { data: { execution: { uuid: 'execution-1' }, contact: null, recent_steps: [], error: null } } }
        )
        const client = createClient()
        const range = { start: '2026-10-01T00:00:00Z', end: '2026-10-06T00:00:00Z', unit: 'day' as const }

        await client.workspace().get()
        await client.campaigns().list({ statuses: ['draft'], page: 1, perPage: 20 })
        await client.campaigns().get('campaign-1')
        await client.campaigns().metrics('campaign-1', range)
        await client.metrics().delivery(range)
        await client.activity().list({ eventTypes: ['contact_created'], perPage: 20 })
        await client.campaigns().executions('campaign-1').get('execution-1', 10)

        expect(fetchMock.mock.calls.map((call) => String(call[0]))).toEqual([
            `${testBaseUrl}/workspace`,
            `${testBaseUrl}/campaigns?statuses=%5B%22draft%22%5D&page=1&per_page=20`,
            `${testBaseUrl}/campaigns/campaign-1`,
            `${testBaseUrl}/campaigns/campaign-1/metrics?start=2026-10-01T00%3A00%3A00Z&end=2026-10-06T00%3A00%3A00Z&unit=day`,
            `${testBaseUrl}/metrics/delivery?start=2026-10-01T00%3A00%3A00Z&end=2026-10-06T00%3A00%3A00Z&unit=day`,
            `${testBaseUrl}/activity?event_types=%5B%22contact_created%22%5D&per_page=20`,
            `${testBaseUrl}/campaigns/campaign-1/executions/execution-1?step_limit=10`
        ])
    })
})
