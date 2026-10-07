# @leadpush/sdk-node

Official TypeScript SDK for the Leadpush API.

Create a Leadpush account at [leadpush.io](https://leadpush.io).

## Installation

```sh
npm install @leadpush/sdk-node
```

```sh
pnpm add @leadpush/sdk-node
```

```sh
yarn add @leadpush/sdk-node
```

## Requirements

- Node.js 22 or newer
- A Leadpush API key

The package ships ESM, CommonJS, and TypeScript declarations.

## Quick Start

```ts
import { Leadpush } from '@leadpush/sdk-node'

const client = new Leadpush(process.env.LEADPUSH_API_KEY!)

const contacts = await client.contacts().list({
  page: 1,
  per_page: 10
})

console.log(contacts.data)
```

## Configuration

```ts
import { Leadpush } from '@leadpush/sdk-node'

const client = new Leadpush('leadpush_api_key', {
  baseUrl: 'https://api.leadpush.io/v1',
  timeout: 30_000,
  headers: {
    'X-App-Name': 'my-app'
  },
})
```

Defaults:

- `baseUrl`: `https://api.leadpush.io/v1`
- `timeout`: `30000`

## Contacts

Contact methods that accept a contact identifier can use either the contact uuid or the workspace identity field value, such as an email address.

**List Or Search Contacts**

```ts
const contacts = await client.contacts().list({
  search: 'person@example.com',
  filters: [
    { id: 'subscribed', value: [true] },
    { id: 'provider', value: ['gmail'] }
  ],
  page: 1,
  perPage: 25
})
```

`per_page` remains supported for compatibility. Contact lists are limited to 25 records per page.
Supported filters are `subscribed` with boolean values and `provider` with Leadpush inbox-provider identifiers.

**Get A Contact**

```ts
const contact = await client.contacts().get('contact_uuid')
const sameContact = await client.contacts().get('person@example.com')

console.log(contact.uuid)
console.log(contact.attributes.email)
```

**Create A Contact**

```ts
const contact = await client.contacts().create({
  subscribed: true,
  attributes: {
    email: 'person@example.com',
    first_name: 'Person'
  }
})
```

**Update A Contact**

```ts
const contact = await client.contacts().update('contact_uuid', {
  subscribed: false,
  attributes: {
    first_name: 'Updated'
  }
})

await client.contacts().update('person@example.com', {
  subscribed: true
})
```

**Update From A Model**

```ts
const contact = await client.contacts().get('contact_uuid')

contact.subscribed = false
contact.setAttribute('first_name', 'Updated')

await contact.update()
```

**Subscribe Or Unsubscribe**

```ts
await client.contacts().subscribe('person@example.com')
await client.contacts().unsubscribe('person@example.com')

await contact.subscribe()
await contact.unsubscribe()
```

**Contact Events**

```ts
const events = await client.contacts().events('contact_uuid').list({
  search: 'purchase'
})

const sameEvents = await client.contacts().events('person@example.com').list()
```

You can also access events from an attached contact model:

```ts
const contact = await client.contacts().get('contact_uuid')
const events = await contact.events().list()
```

**Create A Contact Event**

```ts
await client.contacts().events('contact_uuid').create({
  event_name: 'purchase',
  attributes: {
    plan: 'enterprise'
  }
})

await client.contacts().events('person@example.com').create({
  event_name: 'login'
})
```

Contact event creation resolves when the API accepts the event. The create endpoint does not return the created event.

## Pagination

**List One Page**

```ts
const page = await client.contacts().list({
  page: 1,
  per_page: 25
})

console.log(page.data)
console.log(page.meta.has_next)
```

**Iterate Every Model**

```ts
for await (const contact of client.contacts().listAll({ per_page: 25 })) {
  console.log(contact.uuid)
}
```

**Iterate Page By Page**

```ts
for await (const page of client.contacts().cursor({ per_page: 25 })) {
  console.log(page.meta.current_page, page.data.length)
}
```

## Workspace

```ts
const overview = await client.workspace().get()

console.log(overview.workspace.uuid)
console.log(overview.role)
console.log(overview.counts.contacts)
console.log(overview.sending.has_verified_domain)
```

The workspace is always derived from the API key. Workspace identifiers are not accepted as request parameters.

## Campaigns

**List And Get Campaigns**

```ts
const campaigns = await client.campaigns().list({
  search: 'welcome',
  statuses: ['draft', 'running'],
  page: 1,
  perPage: 25
})

const campaign = await client.campaigns().get('campaign_uuid')
```

Campaign lists are limited to 25 records per page.

**Campaign Metrics**

```ts
const metrics = await client.campaigns().metrics('campaign_uuid', {
  start: '2026-10-01T00:00:00Z',
  end: '2026-10-31T23:59:59Z',
  unit: 'day'
})

console.log(metrics.summary)
console.log(metrics.series)
```

**Inspect A Campaign Execution**

```ts
const inspection = await client
  .campaigns()
  .executions('campaign_uuid')
  .get('execution_uuid', 25)

console.log(inspection.execution.status)
console.log(inspection.recent_steps)
console.log(inspection.error)
```

Execution inspection returns at most 25 recent steps and a sanitized error. It does not expose provider credentials, raw message bodies, internal payloads, or stack traces.

## Delivery Metrics

```ts
const delivery = await client.metrics().delivery({
  start: '2026-10-01T00:00:00Z',
  end: '2026-10-31T23:59:59Z',
  unit: 'day'
})

console.log(delivery.summary.delivered_count)
console.log(delivery.series)
```

Campaign and delivery metric requests use daily buckets and may span at most 90 days.

## Recent Activity

```ts
const activity = await client.activity().list({
  eventTypes: ['contact_created', 'contact_updated'],
  search: 'person@example.com',
  since: '2026-10-01T00:00:00Z',
  page: 1,
  perPage: 25
})

console.log(activity.data)
```

Activity lists are limited to 25 records per page and return a safe subject projection without raw activity attributes.

## Read Endpoint Reference

These paths are relative to the configured `/v1` API base URL.

| SDK operation | REST endpoint |
| --- | --- |
| `workspace().get()` | `GET /workspace` |
| `contacts().list(...)` | `GET /contacts` |
| `contacts().get(id)` | `GET /contacts/{contact}` |
| `campaigns().list(...)` | `GET /campaigns` |
| `campaigns().get(id)` | `GET /campaigns/{campaign}` |
| `campaigns().metrics(id, range)` | `GET /campaigns/{campaign}/metrics` |
| `campaigns().executions(id).get(executionId)` | `GET /campaigns/{campaign}/executions/{execution}` |
| `metrics().delivery(range)` | `GET /metrics/delivery` |
| `activity().list(...)` | `GET /activity` |

## Domains

**List Domains**

```ts
const domains = await client.domains().list({
  search: 'example',
  page: 1,
  per_page: 10
})
```

**Create A Domain**

```ts
const domain = await client.domains().create({
  name: 'example.com',
  dkim_selectors: ['default'],
  tracking_subdomain: 'click',
  tracking_mode: 'cloudflare'
})

console.log(domain.dns)
```

**Verify Or Delete A Domain**

```ts
const verified = await client.domains().verify(domain.uuid)

await client.domains().delete(domain.uuid)
```

You can also verify or delete from an attached domain model:

```ts
const domain = await client.domains().get('domain_uuid')

await domain.verify()
await domain.delete()
```

**Domain Addresses**

```ts
const addresses = await client.domains().addresses('domain_uuid').list()

const address = await client.domains().addresses('domain_uuid').create({
  address: 'sender',
  display_name: 'Sender Name',
  reply_to: 'reply@example.com',
  company_address: '123 Main St',
  company_city: 'New York',
  company_state: 'NY',
  company_zip: '10001',
  company_country: 'US'
})

await client.domains().addresses('domain_uuid').delete(address.uuid)
```

You can also access addresses from an attached domain model:

```ts
const domain = await client.domains().get('domain_uuid')
const addresses = await domain.addresses().list()
```

## Emails

**Send An Email**

```ts
const send = await client.emails().send({
  from: 'sender@example.com',
  subject: 'Developer API email',
  html: '<p>Hello world</p>',
  text: 'Hello world',
  to: [
    'known@example.com',
    'other@example.com'
  ],
  bcc: [
    'audit@example.com'
  ],
  reply_to: 'reply@example.com',
  headers: {
    'X-Correlation-ID': 'abc-123',
    'Auto-Submitted': 'auto-generated'
  }
})

console.log(send.accepted)
console.log(send.messageCount)
console.log(send.messages[0]?.uuid)
```

The `from` address must be a verified sendable address in the API key workspace. Provide `html`, `text`, or both, and at least one recipient across `to` and `bcc`. Leadpush creates one tracked message per unique recipient and returns those message identifiers with initial `pending` status.

## Fields

**List Fields**

```ts
const fields = await client.fields().list({
  search: 'company',
  filters: [
    {
      id: 'type',
      value: ['text']
    }
  ]
})
```

**Create A Field**

```ts
const field = await client.fields().create({
  name: 'company_name',
  type: 'text',
  format: {
    text: 'url'
  }
})
```

## Suppressions

**List Suppressions**

```ts
const suppressions = await client.suppressions().list({
  search: 'blocked@example.com',
  filters: [
    {
      id: 'type',
      value: ['manual']
    }
  ]
})
```

**Create A Suppression**

```ts
const suppression = await client.suppressions().create({
  email: 'blocked@example.com',
  type: 'manual'
})
```

Suppressions do not support updates. Calling `client.suppressions().update(...)` throws `UnsupportedEndpointError`.

## Low-Level Requests

Use `get`, `post`, or `delete` for endpoints that do not have a typed resource yet.

**GET**

```ts
const response = await client.get('contacts/contact_uuid/events')
```

**POST**

```ts
const response = await client.post('contacts/contact_uuid/subscribe')
```

**DELETE**

```ts
await client.delete('contacts/contact_uuid')
```

Paths can also be passed as arrays:

```ts
await client.get(['contacts', 'contact_uuid', 'events'])
```

## Errors

The SDK throws typed errors for common API failures:

```ts
import { UnauthorizedError, ValidationError } from '@leadpush/sdk-node'

try {
  await client.contacts().list()
} catch (error) {
  if (error instanceof UnauthorizedError) {
    console.error('Invalid API key')
  }

  if (error instanceof ValidationError) {
    console.error(error.response)
  }
}
```

Available errors:

- `ApiError`
- `UnauthorizedError`
- `ForbiddenError`
- `NotFoundError`
- `ValidationError`
- `TimeoutError`
- `UnsupportedEndpointError`

## Browser Usage

The published runtime does not depend on Node-only modules. Browser usage is technically possible, but do not expose private Leadpush API keys in frontend code.

## Development

```sh
pnpm install
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
```

## Releasing

Releases are managed with Changesets and GitHub Actions.

For user-facing changes, add a changeset in the same pull request:

```sh
pnpm changeset
```

When changes land on `main`, the release workflow opens or updates a `Version Packages` pull request. Merging that pull request publishes the package to npm and creates a GitHub release.

The release workflow is configured for npm Trusted Publishing through GitHub OIDC. Configure npm trusted publishing for this package with:

- package: `@leadpush/sdk-node`
- repository: this GitHub repository
- workflow filename: `release.yml`
- environment: none
- allowed action: `npm publish`

Do not add an `NPM_TOKEN` secret when using trusted publishing.

## License

MIT
