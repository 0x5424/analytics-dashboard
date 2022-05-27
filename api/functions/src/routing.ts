import { Application } from 'express'
// import { index, create, show, update, destroy } from './controllers/v1/talents'
import { create } from './controllers/v1/talents'

/**
 * Accepts an express app & applies the v1 function routing
 */
export const routesV1 = (app: Application): void => {
  // INDEX
  // CREATE
  app.post('/talents', create)
  // SHOW
  // UPDATE
  // DESTROY
}
