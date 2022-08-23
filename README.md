# Talent Analytics Dashboard

Repository for both backend/frontend code. Serverless backend using firebase

## Dependencies

- Node.js `>= 16`
- (Optional) OpenJDK if running database emulator

## Setup

1. `cd api/functions` and run `npm install`
2. Get the following ENV vars from a developer:
  - `COOKIE_SIGNING_KEY`: Hex encoded string, 32 bytes (passed to `Buffer.from(VAL, 'hex')`)
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
Otherwise, all vars under `web/` will eventually reach the client's browser & as such **MUST BE SAFE TO EXPOSE**

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
/v1
├── /talents
│   ├── GET   : Fetch all talents
│   └── POST  : Insert new talent
│
├── /talents/{id}
│   ├── GET  : Fetch talent by identifier
│   └── PATCH: Update a talent's _integrations_
│
├── /talents/{id}/actions
│   ├── /redirect_twitter
│   │   └── GET : Redirect talent to authorize & link their twitter
│   │
│   └── /tweet_analytics
        └── POST : Retrieve data for specified tweets
│
└── /callbacks
    └── /twitter
        └── GET : Capture authorized talent & persist their OAuth credentials (for analytics)
```

## Usage

Current actions:
- [Admin setup](#admin-setup)
- [Twitter](#twitter-setup)

### Admin Setup

After building/deploying both the `functions` and `web` app:
1. Create an admin via the firebase console
2. Navigate to the webapp sign-in page
3. Login

Now that the admin is in an authenticated state, they should create a new `Talent` for each person they wish to manage.
As each talent can have many associated integrations, it is **not necessary** to create one for each platform.
It is, however, worth noting that 1 talent cannot have **multiple** integrations for each platform.

Example:
Assuming we have a talent named `Xd123`, this user has 3 YouTube channels, 1 Twitch channel, and 1 Twitter.

To replicate this within the dashboard, an admin needs to create at minimum 3 talents:
```
> Xd123 [Main]       |  3 integrations: Twitch, Twitter, YouTube (main channel)
  Xd123 [Highlights] |  1 integration: YouTube (highlights channel)
  Xd123 [VODs]       |  1 integration: YouTube (Full-length vods)
```

## Twitter Setup

0. (If not already done) Create a Talent
1. Select a Talent from sidebar
2. Securely provide the integration redirect link to the talent
  - ie. Twitter will look like `http://LIVE-FIREBASE-URL.com/v1/talents/Xd123/actions/redirect_twitter`

Once the talent has followed the redirect & confirmed OAuth access, the admin panel will now list actions for that integration.

## Todo

Known issues/missing features:
- [ ] No instructions for non-emulator usage
- [ ] CI/CD
- [ ] No deletion/unlinking twitter credentials
- [ ] No deletion of talents

DX:
- [ ] Clean up integrations logic/structure
  - [ ] Twitter
- [ ] `solid.js` best practices for passing signals to child components

UX:
- [ ] Error messages for revoked tokens

(Integration specific) Twitter:
- [ ] No option to support engagements API
