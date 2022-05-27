import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'

// Routing
import { routesV1 } from './routing'

admin.initializeApp()
const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: true }))

// Apply routing
routesV1(app)

/**
 * V1 routing; If/when v2 is needed, allows for configuring entirely new middleware
 */
export const v1 = functions.https.onRequest(app)
