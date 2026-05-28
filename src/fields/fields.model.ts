import { Model } from '../model'

export type FieldType = 'integer' | 'text' | 'date' | 'datetime' | 'boolean'

export type FieldTextFormat = 'email' | 'phone' | 'uuid' | 'url' | 'regex'

/**
 * Field format configuration returned by the API.
 */
export interface FieldFormat {
    text: FieldTextFormat | null
    pattern: string | null
    iso_format: string | null
}

/**
 * Raw field data returned by the API.
 */
export interface FieldData {
    uuid: string
    name: string
    type: FieldType
    format: FieldFormat | null
    created_at: string
}

/**
 * Payload accepted by field creation.
 */
export interface CreateFieldData {
    name: string
    type: FieldType
    format?: Partial<FieldFormat> | null
}

export type UpdateFieldData = Partial<CreateFieldData>

/**
 * Filter fields by type.
 */
export interface FieldTypeFilter {
    id: 'type'
    value: FieldType[]
}

export type FieldFilter = FieldTypeFilter

/**
 * Custom contact field returned by the Leadpush API.
 */
export class FieldModel extends Model<FieldData, UpdateFieldData, FieldModel> {
    /**
     * Field id.
     */
    get uuid(): string {
        return this.data.uuid
    }

    /**
     * Field name.
     */
    get name(): string {
        return this.data.name
    }

    /**
     * Field data type.
     */
    get type(): FieldType {
        return this.data.type
    }

    /**
     * Field format configuration.
     */
    get format(): FieldFormat | null {
        return this.data.format
    }

    /**
     * Field creation date.
     */
    get createdAt(): Date {
        return new Date(this.data.created_at)
    }
}
