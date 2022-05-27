import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'

admin.initializeApp()
const app = express()

app.get('/', (req: express.Request, res: express.Response) => {
  return res.status(200).send('success')
})

export const api = functions.https.onRequest(app)
