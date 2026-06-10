import { ApiError, ForbiddenError, NotFoundError, TimeoutError, UnauthorizedError, ValidationError } from './errors'

export type RequestPath = string | readonly string[]

export type RequestParamValue = string | number | boolean | object | readonly object[] | undefined

export type RequestParams = Record<string, RequestParamValue>

type RequestMethod = 'DELETE' | 'GET' | 'POST'

export interface HttpClientOptions {
    /**
     * Leadpush API key used for bearer authentication.
     */
    apiKey: string

    /**
     * Leadpush API version used by this SDK.
     */
    apiVersion: string

    /**
     * Base URL for the Leadpush API.
     */
    baseUrl: string

    /**
     * Additional headers sent with each API request.
     */
    headers: Record<string, string>

    /**
     * Name of this SDK package.
     */
    sdkName: string

    /**
     * Version of the installed SDK package.
     */
    sdkVersion: string

    /**
     * Request timeout in milliseconds. Use `0` to disable timeouts.
     */
    timeout: number

    /**
     * User agent sent with each API request in Node.js runtimes.
     */
    userAgent: string
}

/**
 * Internal HTTP client used by Leadpush resources.
 */
export class HttpClient {
    /**
     * Create an HTTP client.
     *
     * @param options - HTTP client configuration.
     */
    constructor(private readonly options: HttpClientOptions) {}

    /**
     * Make a GET request.
     *
     * @param path - API path relative to the configured base URL.
     * @param params - Optional query parameters.
     */
    async get<TResponse>(path: RequestPath, params: RequestParams = {}): Promise<TResponse> {
        return await this.request<TResponse>('GET', path, undefined, params)
    }

    /**
     * Make a POST request.
     *
     * @param path - API path relative to the configured base URL.
     * @param data - Optional JSON request body.
     * @param params - Optional query parameters.
     */
    async post<TResponse>(path: RequestPath, data?: object, params: RequestParams = {}): Promise<TResponse> {
        return await this.request<TResponse>('POST', path, data, params)
    }

    /**
     * Make a DELETE request.
     *
     * @param path - API path relative to the configured base URL.
     * @param params - Optional query parameters.
     */
    async delete<TResponse>(path: RequestPath, params: RequestParams = {}): Promise<TResponse> {
        return await this.request<TResponse>('DELETE', path, undefined, params)
    }

    private async request<TResponse>(
        method: RequestMethod,
        path: RequestPath,
        data: object | undefined,
        params: RequestParams
    ): Promise<TResponse> {
        const request: RequestInit = {
            headers: this.getHeaders(data)
        }
        let timeout: ReturnType<typeof setTimeout> | undefined

        if (method !== 'GET') {
            request.method = method
        }

        if (data !== undefined) {
            request.body = JSON.stringify(data)
        }

        if (this.options.timeout > 0) {
            const controller = new AbortController()

            timeout = setTimeout(() => {
                controller.abort()
            }, this.options.timeout)
            request.signal = controller.signal
        }

        try {
            const response = await fetch(this.getUrl(path, params), request)

            return await this.parseResponse<TResponse>(response)
        } catch (error) {
            if (this.isAbortError(error)) {
                throw new TimeoutError(this.options.timeout)
            }

            throw error
        } finally {
            if (timeout !== undefined) {
                clearTimeout(timeout)
            }
        }
    }

    private getUrl(path: RequestPath, params: RequestParams): string {
        const baseUrl = this.options.baseUrl.replace(/\/+$/, '')
        const pathSegments = this.getPathSegments(path)
        const url = new URL(
            `${baseUrl}/${pathSegments.map((segment) => encodeURIComponent(segment)).join('/')}`
        )

        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                url.searchParams.set(key, this.serializeQueryValue(value))
            }
        }

        return url.toString()
    }

    private getHeaders(data?: object): Record<string, string> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            Authorization: `Bearer ${this.options.apiKey}`,
            'X-Leadpush-API-Version': this.options.apiVersion,
            'X-Leadpush-SDK': this.options.sdkName,
            'X-Leadpush-SDK-Version': this.options.sdkVersion,
            ...this.options.headers
        }

        if (this.shouldSendUserAgentHeader()) {
            headers['User-Agent'] = this.options.userAgent
        }

        if (data !== undefined) {
            return {
                ...headers,
                'Content-Type': 'application/json'
            }
        }

        return headers
    }

    private async parseResponse<TResponse>(response: Response): Promise<TResponse> {
        const payload = await this.parseResponseBody(response)

        if (response.ok) {
            return payload as TResponse
        }

        if (response.status === 401) {
            throw new UnauthorizedError(payload)
        }

        if (response.status === 403) {
            throw new ForbiddenError(payload)
        }

        if (response.status === 404) {
            throw new NotFoundError(payload)
        }

        if (response.status === 422) {
            throw new ValidationError(payload)
        }

        throw new ApiError(response.status, payload)
    }

    private async parseResponseBody(response: Response): Promise<unknown> {
        const text = await response.text()

        if (text.length === 0) {
            return undefined
        }

        try {
            return JSON.parse(text) as unknown
        } catch {
            return text
        }
    }

    private getPathSegments(path: RequestPath): string[] {
        if (typeof path === 'string') {
            return path.split('/').filter((part) => part.length > 0)
        }

        return path.filter((part) => part.length > 0)
    }

    private serializeQueryValue(value: Exclude<RequestParams[string], undefined>): string {
        if (typeof value === 'object') {
            return JSON.stringify(value)
        }

        return String(value)
    }

    private isAbortError(error: unknown): boolean {
        return typeof error === 'object'
            && error !== null
            && 'name' in error
            && error.name === 'AbortError'
    }

    private shouldSendUserAgentHeader(): boolean {
        return typeof process !== 'undefined'
            && process.versions?.node !== undefined
    }
}
