export interface DateRange {
    start: string
    end: string
    unit: 'day'
}

export interface MetricReport {
    range: DateRange
    summary: Record<string, number>
    series: Array<Record<string, number | string | null>>
}

export type DeliveryMetrics = MetricReport
