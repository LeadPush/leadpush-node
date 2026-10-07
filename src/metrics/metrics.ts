import type { Leadpush } from '../leadpush'
import type { DateRange, DeliveryMetrics } from './metrics.model'

export class Metrics {
    constructor(private readonly client: Leadpush) {}

    async delivery(range: DateRange): Promise<DeliveryMetrics> {
        return (await this.client.get<{ data: DeliveryMetrics }>(['metrics', 'delivery'], {
            start: range.start,
            end: range.end,
            unit: range.unit
        })).data
    }
}
