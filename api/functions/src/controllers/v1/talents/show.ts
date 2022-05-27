import { Request, Response } from 'express'
import { getDatabase } from 'firebase-admin/database'

import { handleError } from '../utils/errors'

export const show = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    let out = {}

    await getDatabase().ref(`/talents/${id}`).once('value', (snapshot) => {
      out = snapshot.val()
    })

    if (out) return res.status(200).send(out)

    return res.status(404).send({ message: 'Not found' })
  } catch (err) {
    return handleError(res, err)
  }
}
