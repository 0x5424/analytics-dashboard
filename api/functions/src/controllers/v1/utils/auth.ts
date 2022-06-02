import * as admin from 'firebase-admin'
import {Request, Response} from 'express'

const UNAUTHORIZED = {message: 'Unauthorized'}

export const isAuthenticated = async (req: Request, res: Response, next: () => void) => {
  const {authorization} = req.headers

  if (!authorization) return res.status(401).send(UNAUTHORIZED)

  if (!authorization.startsWith('Bearer')) return res.status(401).send(UNAUTHORIZED)

  const split = authorization.split('Bearer ')
  if (split.length !== 2) return res.status(401).send(UNAUTHORIZED)

  const token = split[1]

  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token)
    if (decodedToken.role !== 'admin') return res.status(401).send(UNAUTHORIZED)

    return next()
  } catch (err) {
    return res.status(401).send(UNAUTHORIZED)
  }
}
