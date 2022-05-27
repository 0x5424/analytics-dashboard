import { Request, Response } from 'express'
import { getDatabase } from 'firebase-admin/database'

import { handleError } from '../utils/errors'

export const all = async (req: Request, res: Response) => {
  try {
    const talents: any[] = []

    await getDatabase().ref('/talents').orderByChild('timestamp').once('value', (snapshot) => {
      snapshot.forEach((data) => {
        talents.push(data.val())
      })
    })

    return res.status(200).send({ talents })
  } catch (err) {
    return handleError(res, err)
  }
}
