import { Request, Response } from 'express'
import { getDatabase, ServerValue } from 'firebase-admin/database'
import { randomUUID } from 'crypto'

const handleError = (res: Response, err: any) => {
  return res.status(500).send({ message: `${err.code} : ${err.message}` })
}

export const create = (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name) return res.status(400).send({ message: 'Missing name' })

    const id = randomUUID()
    getDatabase().ref(`/talents/${id}`).set({
      name,
      timestamp: ServerValue.TIMESTAMP,
      created_at: ServerValue.TIMESTAMP
    })

    return res.status(201).send({ id })
  } catch (err) {
    return handleError(res, err)
  }
}
