import type { Leadpush } from './leadpush'
import type { RequestParams, RequestPath } from './http'

export type { RequestParamValue, RequestParams, RequestPath } from './http'

/**
 * Narrow API context attached to models returned by the SDK.
 */
export interface ModelContext<TUpdateData extends object, TModel> {
    /**
     * Leadpush API client that created the model.
     */
    client: Leadpush

    /**
     * Make a GET request relative to the model's parent resource.
     */
    get<TResponse>(path: RequestPath, params?: RequestParams): Promise<TResponse>

    /**
     * Make a POST request relative to the model's parent resource.
     */
    post<TResponse>(path: RequestPath, data?: object, params?: RequestParams): Promise<TResponse>

    /**
     * Make a DELETE request relative to the model's parent resource.
     */
    delete<TResponse>(path: RequestPath, params?: RequestParams): Promise<TResponse>

    /**
     * Update the model's backing resource.
     */
    update(id: string, data: TUpdateData): Promise<TModel>
}

/**
 * Base class for Leadpush API response models.
 */
export abstract class Model<
    TData extends object,
    TUpdateData extends object = Partial<TData>,
    TModel extends Model<TData, TUpdateData, TModel> = never
> {
    private dirty: Partial<TUpdateData> = {}

    /**
     * Create a response model.
     *
     * @param data - Raw API data backing the model.
     * @param context - Optional API context for attached model operations.
     */
    constructor(
        protected data: TData,
        protected readonly context?: ModelContext<TUpdateData, TModel>
    ) {}

    /**
     * Return the raw API data backing this model.
     */
    toJSON(): TData {
        return this.data
    }

    protected clearDirty(): void {
        this.dirty = {}
    }

    protected getDirty(): TUpdateData {
        return { ...this.dirty } as TUpdateData
    }

    protected isDirty(): boolean {
        return Object.keys(this.dirty).length > 0
    }

    protected replaceData(data: TData): void {
        this.data = data
    }

    protected requireContext(): ModelContext<TUpdateData, TModel> {
        if (this.context === undefined) {
            throw new Error('This model is not attached to an API client.')
        }

        return this.context
    }

    protected setDirty<TKey extends keyof TUpdateData>(key: TKey, value: TUpdateData[TKey]): void {
        this.dirty[key] = value
    }

    protected get<TResponse>(path: RequestPath, params?: RequestParams): Promise<TResponse> {
        return this.requireContext().get<TResponse>(path, params)
    }

    protected post<TResponse>(path: RequestPath, data?: object, params?: RequestParams): Promise<TResponse> {
        return this.requireContext().post<TResponse>(path, data, params)
    }

    protected requestDelete<TResponse>(path: RequestPath, params?: RequestParams): Promise<TResponse> {
        return this.requireContext().delete<TResponse>(path, params)
    }
}
