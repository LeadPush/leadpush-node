import { UnsupportedEndpointError } from './errors'
import type { Leadpush } from './leadpush'
import { Model, type ModelContext, type RequestParams, type RequestPath } from './model'

type ModelConstructor<
    TData extends object,
    TModel extends Model<TData, TUpdateData, TModel>,
    TUpdateData extends object
> = new (data: TData, context?: ModelContext<TUpdateData, TModel>) => TModel

export interface ListParams {
    /**
     * Page number to request.
     */
    page?: number

    /**
     * Number of records per page.
     */
    per_page?: number
}

export interface PaginationMeta {
    /**
     * Current page number.
     */
    current_page: number

    /**
     * Number of records returned per page.
     */
    per_page: number

    /**
     * Total number of records matching the request.
     */
    total: number

    /**
     * Last available page number.
     */
    last_page: number

    /**
     * Whether another page is available after the current page.
     */
    has_next: boolean
}

export interface PaginatedResponse<T> {
    /**
     * Models returned for the current page.
     */
    data: T[]

    /**
     * Pagination metadata returned by the API.
     */
    meta: PaginationMeta
}

export interface ResourceResponse<T> {
    /**
     * Resource returned by the API.
     */
    data: T
}

/**
 * Base class for Leadpush API resources.
 */
export abstract class Resource<
    TData extends object,
    TModel extends Model<TData, TUpdateData, TModel>,
    TUpdateData extends object = Partial<TData>
> {
    /**
     * API path for the resource.
     */
    abstract endpoint: RequestPath

    /**
     * Model class used to wrap resource response data.
     */
    abstract model: ModelConstructor<TData, TModel, TUpdateData>

    /**
     * Create a resource handler.
     *
     * @param client - Leadpush API client.
     */
    constructor(readonly client: Leadpush) {}

    protected makeModel(data: TData): TModel {
        return new this.model(data, {
            client: this.client,
            get: (path, params) => this.getResource(path, params),
            post: (path, data, params) => this.postResource(path, data, params),
            delete: (path, params) => this.deleteResource(path, params),
            update: (id, updateData) => this.updateModel(id, updateData)
        })
    }

    protected async getResource<TResponse>(path?: RequestPath, params: RequestParams | ListParams = {}): Promise<TResponse> {
        return await this.client.get<TResponse>(this.getResourcePath(path), params as RequestParams)
    }

    protected async postResource<TResponse>(
        path?: RequestPath,
        data?: object,
        params: RequestParams = {}
    ): Promise<TResponse> {
        return await this.client.post<TResponse>(this.getResourcePath(path), data, params)
    }

    protected async deleteResource<TResponse>(path?: RequestPath, params: RequestParams = {}): Promise<TResponse> {
        return await this.client.delete<TResponse>(this.getResourcePath(path), params)
    }

    protected updateModel(_id: string, _data: TUpdateData): Promise<TModel> {
        void _id
        void _data

        throw new UnsupportedEndpointError('This resource does not support model updates.')
    }

    private getResourcePath(path?: RequestPath): RequestPath {
        const endpoint = this.getPathSegments(this.endpoint)

        if (path === undefined) {
            return endpoint
        }

        if (typeof path === 'string') {
            return [...endpoint, path]
        }

        return [...endpoint, ...path]
    }

    private getPathSegments(path: RequestPath): string[] {
        if (typeof path === 'string') {
            return path.split('/').filter((segment) => segment.length > 0)
        }

        return [...path]
    }
}

/**
 * Base class for listable Leadpush API resources.
 */
export abstract class ListableResource<
    TData extends object,
    TModel extends Model<TData, TUpdateData, TModel>,
    TUpdateData extends object = Partial<TData>,
    TListParams extends ListParams = ListParams
> extends Resource<TData, TModel, TUpdateData> {
    /**
     * List one page of resources.
     *
     * @param params - Optional pagination, search, filter, or resource-specific query parameters.
     */
    async list(params: TListParams = {} as TListParams): Promise<PaginatedResponse<TModel>> {
        const payload = await this.getResource<PaginatedResponse<TData>>(undefined, params)

        return {
            data: payload.data.map((item) => this.makeModel(item)),
            meta: payload.meta
        }
    }

    /**
     * Iterate all resources across all available pages.
     *
     * @param params - Optional pagination, search, filter, or resource-specific query parameters.
     */
    async *listAll(params: TListParams = {} as TListParams): AsyncGenerator<TModel> {
        for await (const page of this.cursor(params)) {
            for (const item of page.data) {
                yield item
            }
        }
    }

    /**
     * Iterate paginated responses across all available pages.
     *
     * @param params - Optional pagination, search, filter, or resource-specific query parameters.
     */
    async *cursor(params: TListParams = {} as TListParams): AsyncGenerator<PaginatedResponse<TModel>> {
        let page = params.page ?? 1

        while (true) {
            const result = await this.list({
                ...params,
                page,
            } as TListParams)

            yield result

            if (!result.meta.has_next) {
                return
            }

            page = result.meta.current_page + 1
        }
    }
}

/**
 * Base class for Leadpush API entities that support CRUD-style operations.
 */
export abstract class Entity<
    TData extends object,
    TModel extends Model<TData, TUpdateData, TModel>,
    TCreateData extends object = Partial<TData>,
    TUpdateData extends object = Partial<TCreateData>,
    TListParams extends ListParams = ListParams
> extends ListableResource<TData, TModel, TUpdateData, TListParams> {
    /**
     * Create a resource.
     *
     * @param data - Resource creation payload.
     */
    async create(data: TCreateData): Promise<TModel> {
        const payload = await this.postResource<ResourceResponse<TData>>(undefined, data)

        return this.makeModel(payload.data)
    }

    /**
     * Update a resource by id.
     *
     * @param id - Resource id.
     * @param data - Resource update payload.
     */
    async update(id: string, data: TUpdateData): Promise<TModel> {
        const payload = await this.postResource<ResourceResponse<TData>>([id], data)

        return this.makeModel(payload.data)
    }

    /**
     * Get a resource by id.
     *
     * @param id - Resource id.
     */
    async get(id: string): Promise<TModel> {
        const payload = await this.getResource<ResourceResponse<TData>>([id])

        return this.makeModel(payload.data)
    }

    protected override updateModel(id: string, data: TUpdateData): Promise<TModel> {
        return this.update(id, data)
    }
}
