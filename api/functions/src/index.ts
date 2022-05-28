import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cookieEncryptor from 'cookie-encrypter'

// Routing
import { routesV1 } from './routing'

admin.initializeApp()
const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: true }))

/**
 * @note Firebase only has access to .env vars inside the `onRequest` function
 *
 * @see https://github.com/firebase/firebase-tools/issues/4239
 */
if (!process.env.COOKIE_SIGNING_KEY) {
  console.warn('[process.env] Variables are NOT currently loaded; Running dotenv to fix this in development.')
  require('dotenv').config()
}

app.use(cookieParser(atob(process.env.COOKIE_SIGNING_KEY)))
app.use(cookieEncryptor(Buffer.from(process.env.COOKIE_ENCRYPTION_KEY, 'hex')))


// Apply routing
routesV1(app)

/**
 * V1 routing; If/when v2 is needed, allows for configuring entirely new middleware
 */
export const v1 = functions.https.onRequest(app)
