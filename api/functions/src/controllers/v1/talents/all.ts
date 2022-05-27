import { Request, Response } from 'express'
import { getDatabase } from 'firebase-admin/database'

import { handleError } from '../utils/errors'

export const all = async (req: Request, res: Response) => {
  try {
    let out: any = {}
    await getDatabase().ref('/talents').orderByChild('timestamp').once('value', (snapshot) => {
      out = snapshot.val()
    })

    if (out) return res.status(200).send(out)

    return res.status(200).send({})
  } catch (err) {
    return handleError(res, err)
  }
}