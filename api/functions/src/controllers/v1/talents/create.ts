import { Request, Response } from 'express'
import { getDatabase, ServerValue } from 'firebase-admin/database'
import { randomUUID } from 'crypto'

import { handleError } from '../utils/errors'

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name) return res.status(400).send({ message: 'Missing name' })

    const id = randomUUID()
    await getDatabase().ref(`/talents/${id}`).set({
      name,
      timestamp: ServerValue.TIMESTAMP,
      created_at: ServerValue.TIMESTAMP
    })

    return res.status(201).send({ id })
  } catch (err) {
    return handleError(res, err)
  }
}
