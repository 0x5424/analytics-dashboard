# Talent Analytics Dashboard

Repository for both backend/frontend code. Serverless backend using firebase

## Dependencies

- Node.js `>= 16`
- (Optional) OpenJDK if running database emulator

## Setup

1. `cd api/functions` and run `npm install`
2. Get the following ENV vars from a developer:
  - `COOKIE_SIGNING_KEY`: Must be 32 bytes, hex-encoded (passed to `Buffer.from(VAL, 'hex')`)
  - `COOKIE_ENCRYPTION_KEY`: (same as above)
  - `TWITTER_API_KEY`
  - `TWITTER_API_SECRET`
  - `TWITTER_REDIRECT_URL`
3. Test the app locally by running `npm run serve`

Example to create new cookie credentials in development:
```
const { randomBytes } = await import('node:crypto')
Buffer.from(randomBytes(32)).toString('hex')
```

## Project Structure

In general, ENV vars used under `api/` are **NOT SAFE TO EXPOSE**. They are persisted only on Google servers.
On the contrary, all code under `web/` will eventually reach the client browser & as such **MUST BE SAFE TO EXPOSE**

```
.
├── api
│   ├── functions
│   │    └── * - Firebase function code; responsible for handling all incoming requests
│   └── database.rules.json - Firebase realtime db rules; validates incoming schema data
│
└── web - Admin dashboard app; written with solid.js
```

## API Endpoints

Each function **MUST** be namespaced by using `v#`, where # is an incremental version number.
The endpoints each function will respond to will vary depending on business logic, but are largely ordered by resource name.

Here is the current specification for v1:
```
v1
├── /talents
│   ├── GET   : Fetch all talents
│   ├── POST  : Insert new talent
│   └── /{id}
│       ├── GET  : Fetch talent by identifier
│       └── PATCH: Update a talent's _integrations_
│           └── /actions
│               ├── GET /redirect_twitter : Redirect talent to authorize & link their twitter
│               └── POST /tweet_analytics : Retrieve data for specified tweets
│
└── /callbacks
    └── /twitter
        └── GET : Capture authorized talent & persist their OAuth credentials (for analytics)
```
