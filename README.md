# Talent Analytics Dashboard

Repository for both backend/frontend code. Serverless backend using firebase

## Dependencies

- Node.js `>= 16`

## Setup

1. `cd api/functions` and run `npm install`
2. Get the following ENV vars from a developer:
  - `COOKIE_SIGNING_KEY`: Must be the result of `32 bytes`, b64-encoded
  - `COOKIE_ENCRYPTION_KEY`: (same as above)
  - `TWITTER_API_KEY`
  - `TWITTER_API_SECRET`
3. Test the app locally by running `npm run serve`

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
