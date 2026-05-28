export interface LeadpushErrorOptions {
    /**
     * HTTP status code returned by the API.
     */
    status?: number

    /**
     * Parsed API response body, when available.
     */
    response?: unknown
}

/**
 * Base error thrown by the Leadpush SDK.
 */
export class LeadpushError extends Error {
    /**
     * HTTP status code returned by the API.
     */
    readonly status?: number

    /**
     * Parsed API response body, when available.
     */
    readonly response?: unknown

    /**
     * Create an SDK error.
     */
    constructor(message: string, options: LeadpushErrorOptions = {}) {
        super(message)
        this.name = 'LeadpushError'

        if (options.status !== undefined) {
            this.status = options.status
        }

        if ('response' in options) {
            this.response = options.response
        }
    }
}

/**
 * Error thrown when the Leadpush API returns a non-success status.
 */
export class ApiError extends LeadpushError {
    /**
     * Create an API error.
     */
    constructor(status: number, response?: unknown) {
        super(`Leadpush API request failed with status ${status}.`, {
            status,
            response
        })
        this.name = 'ApiError'
    }
}

/**
 * Error thrown when the API rejects the request as unauthenticated.
 */
export class UnauthorizedError extends ApiError {
    /**
     * Create an unauthorized API error.
     */
    constructor(response?: unknown) {
        super(401, response)
        this.name = 'UnauthorizedError'
        this.message = 'Unauthorized. Check your Leadpush API key.'
    }
}

/**
 * Error thrown when the API rejects the request as forbidden.
 */
export class ForbiddenError extends ApiError {
    /**
     * Create a forbidden API error.
     */
    constructor(response?: unknown) {
        super(403, response)
        this.name = 'ForbiddenError'
    }
}

/**
 * Error thrown when the requested resource is not found.
 */
export class NotFoundError extends ApiError {
    /**
     * Create a not-found API error.
     */
    constructor(response?: unknown) {
        super(404, response)
        this.name = 'NotFoundError'
    }
}

/**
 * Error thrown when the API rejects request validation.
 */
export class ValidationError extends ApiError {
    /**
     * Create a validation API error.
     */
    constructor(response?: unknown) {
        super(422, response)
        this.name = 'ValidationError'
    }
}

/**
 * Error thrown when a Leadpush API request times out.
 */
export class TimeoutError extends LeadpushError {
    /**
     * Create a request timeout error.
     */
    constructor(timeout: number) {
        super(`Leadpush API request timed out after ${timeout}ms.`)
        this.name = 'TimeoutError'
    }
}

/**
 * Error thrown when an SDK method maps to an unsupported API endpoint.
 */
export class UnsupportedEndpointError extends LeadpushError {
    /**
     * Create an unsupported endpoint error.
     */
    constructor(message: string) {
        super(message)
        this.name = 'UnsupportedEndpointError'
    }
}
