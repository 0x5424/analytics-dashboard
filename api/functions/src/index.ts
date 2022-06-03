import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cookieEncryptor from 'cookie-encrypter'

// Routing
import {routesV1} from './routing'

admin.initializeApp()
const app = express()
app.use(bodyParser.json())
app.use(cors({origin: process.env.WEB_APP_ORIGIN}))

/**
 * @note Firebase only has access to .env vars inside the `onRequest` function
 *
 * @see https://github.com/firebase/firebase-tools/issues/4239
 */
if (!process.env.COOKIE_SIGNING_KEY) {
  console.warn('[process.env] Variables are NOT currently loaded; Running dotenv to fix this in development.')
  require('dotenv').config() // eslint-disable-line @typescript-eslint/no-var-requires
}

// 1. Signing key is 32 raw bytes, hex-encoded
app.use(cookieParser(Buffer.from(process.env.COOKIE_SIGNING_KEY, 'hex').toString()))
// 2. Encryption key is 32 raw bytes, hex-enoded
app.use(cookieEncryptor(Buffer.from(process.env.COOKIE_ENCRYPTION_KEY, 'hex')))

// Apply routing
routesV1(app)

/**
 * V1 routing; If/when v2 is needed, allows for configuring entirely new middleware
 */
export const v1 = functions.https.onRequest(app)

/**
 * *MUST* disable all sign-ups, else users can create their own tokens to access the dashboard
 *
 * @see {@link https://github.com/firebase/firebaseui-web/issues/99#issuecomment-359443621 | Amazing 5 year old issue}
 */
export const blockSignup = functions.auth.user().onCreate(({uid}) => {
  return admin.auth().updateUser(uid, {disabled: true})
    .then((userRecord) => functions.logger.log('Auto blocked user', userRecord.toJSON()))
    .catch((error) => functions.logger.error('Error auto blocking:', error))
})
