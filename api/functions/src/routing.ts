import { Application } from 'express'
// import { all, create, show, update, destroy } from './controllers/v1/talents'
import { all, create, show } from './controllers/v1/talents'

/**
 * Accepts an express app & applies the v1 function routing
 */
export const routesV1 = (app: Application): void => {
  /* Talent resources */
  app.get('/talents', all)
  app.post('/talents', create)
  app.get('/talents/:id', show)
  // app.patch('/talents/:id', update)
  // app.delete('/talents/:id', destroy)
}
