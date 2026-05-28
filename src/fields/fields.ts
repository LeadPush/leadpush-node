import { Entity, type ListParams } from '../entity'
import {
    FieldModel,
    type CreateFieldData,
    type FieldData,
    type FieldFilter,
    type UpdateFieldData
} from './fields.model'

export interface ListFieldsParams extends ListParams {
    /**
     * Search fields by name.
     */
    search?: string

    /**
     * Filters to apply to the field list.
     */
    filters?: FieldFilter[]
}

/**
 * Field API resource.
 */
export class Fields extends Entity<FieldData, FieldModel, CreateFieldData, UpdateFieldData, ListFieldsParams> {
    /**
     * API path segment for fields.
     */
    override endpoint = 'fields'

    /**
     * Model class returned by field operations.
     */
    override model = FieldModel
}
