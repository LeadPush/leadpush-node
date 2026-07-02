import { Contacts } from './contacts/contacts'
import { Domains } from './domains/domains'
import { Emails } from './emails/emails'
import { Fields } from './fields/fields'
import { HttpClient, type RequestParams, type RequestPath } from './http'
import { Suppressions } from './suppressions/suppressions'

declare const __LEADPUSH_SDK_VERSION__: string

/**
 * Name of this SDK package.
 */
export const SDK_NAME = '@leadpush/sdk-node'

/**
 * Version of the installed SDK package.
 */
export const SDK_VERSION = __LEADPUSH_SDK_VERSION__

/**
 * Leadpush API version used by this SDK.
 */
export const API_VERSION = 'v1'

/**
 * Default user agent sent in Node.js runtimes.
 */
export const DEFAULT_USER_AGENT = `${SDK_NAME}/${SDK_VERSION} (api=${API_VERSION})`

/**
 * Default Leadpush API base URL.
 */
export const DEFAULT_BASE_URL = `https://api.leadpush.io/${API_VERSION}`

/**
 * Default request timeout in milliseconds.
 */
export const DEFAULT_TIMEOUT = 30_000

export interface Options {
    /**
     * Base URL for the Leadpush API.
     */
    baseUrl: string

    /**
     * Request timeout in milliseconds. Use `0` to disable timeouts.
     */
    timeout: number

    /**
     * Additional headers sent with each API request.
     */
    headers: Record<string, string>

    /**
     * User agent sent with each API request in Node.js runtimes.
     */
    userAgent: string
}

/**
 * Leadpush API client.
 */
export class Leadpush {
    /**
     * Version of the installed SDK package.
     */
    readonly version: string

    /**
     * Runtime options used by the client.
     */
    readonly options: Options

    private readonly http: HttpClient

    /**
     * Create a Leadpush API client.
     *
     * @param key - Leadpush API key.
     * @param _options - Optional client configuration.
     */
    constructor (readonly key: string, _options: Partial<Options> = {}) {
        this.version = SDK_VERSION
        this.options = {
            baseUrl: DEFAULT_BASE_URL,
            timeout: DEFAULT_TIMEOUT,
            headers: {},
            userAgent: DEFAULT_USER_AGENT,
            ..._options
        }
        this.http = new HttpClient({
            apiKey: this.key,
            apiVersion: API_VERSION,
            baseUrl: this.options.baseUrl,
            headers: this.options.headers,
            sdkName: SDK_NAME,
            sdkVersion: SDK_VERSION,
            timeout: this.options.timeout,
            userAgent: this.options.userAgent,
        })
    }

    /**
     * Make a GET request to the Leadpush API.
     *
     * @param path - API path relative to the configured base URL.
     * @param params - Optional query parameters.
     */
    get<TResponse>(path: RequestPath, params: RequestParams = {}): Promise<TResponse> {
        return this.http.get<TResponse>(path, params)
    }

    /**
     * Make a POST request to the Leadpush API.
     *
     * @param path - API path relative to the configured base URL.
     * @param data - Optional JSON request body.
     * @param params - Optional query parameters.
     */
    post<TResponse>(path: RequestPath, data?: object, params: RequestParams = {}): Promise<TResponse> {
        return this.http.post<TResponse>(path, data, params)
    }

    /**
     * Make a DELETE request to the Leadpush API.
     *
     * @param path - API path relative to the configured base URL.
     * @param params - Optional query parameters.
     */
    delete<TResponse>(path: RequestPath, params: RequestParams = {}): Promise<TResponse> {
        return this.http.delete<TResponse>(path, params)
    }

    /**
     * Access contact API operations.
     */
    contacts() {
        return new Contacts(this)
    }

    /**
     * Access domain API operations.
     */
    domains() {
        return new Domains(this)
    }

    /**
     * Access email sending API operations.
     */
    emails() {
        return new Emails(this)
    }

    /**
     * Access custom field API operations.
     */
    fields() {
        return new Fields(this)
    }

    /**
     * Access suppression API operations.
     */
    suppressions() {
        return new Suppressions(this)
    }
}
