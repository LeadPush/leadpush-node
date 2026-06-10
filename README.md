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
for await (const contact of client.contacts().listAll({ per_page: 100 })) {
  console.log(contact.uuid)
}
```

**Iterate Page By Page**

```ts
for await (const page of client.contacts().cursor({ per_page: 100 })) {
  console.log(page.meta.current_page, page.data.length)
}
```

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
