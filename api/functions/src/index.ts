import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'

admin.initializeApp()
const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: true }))

app.get('/', (req: express.Request, res: express.Response) => {
  return res.status(200).send('success')
})

export const api = functions.https.onRequest(app)
