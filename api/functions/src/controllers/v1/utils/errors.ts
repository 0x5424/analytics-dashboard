import {Response} from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (res: Response, err: any) => {
  return res.status(500).send({message: `${err.code} : ${err.message}`})
}
