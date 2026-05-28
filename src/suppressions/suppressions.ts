import { Entity, type ListParams } from '../entity'
import { UnsupportedEndpointError } from '../errors'
import {
    SuppressionModel,
    type CreateSuppressionData,
    type SuppressionData,
    type SuppressionFilter,
    type UpdateSuppressionData
} from './suppressions.model'

export interface ListSuppressionsParams extends ListParams {
    /**
     * Search suppressions by email.
     */
    search?: string

    /**
     * Filters to apply to the suppression list.
     */
    filters?: SuppressionFilter[]
}

/**
 * Suppression API resource.
 */
export class Suppressions extends Entity<
    SuppressionData,
    SuppressionModel,
    CreateSuppressionData,
    UpdateSuppressionData,
    ListSuppressionsParams
> {
    /**
     * API path segment for suppressions.
     */
    override endpoint = 'suppressions'

    /**
     * Model class returned by suppression operations.
     */
    override model = SuppressionModel

    /**
     * Suppressions do not support updates.
     */
    override async update(_id: string, _data: UpdateSuppressionData): Promise<SuppressionModel> {
        void _id
        void _data

        throw new UnsupportedEndpointError('The suppressions update endpoint is not supported.')
    }
}
