import { Application } from 'express'
// import { all, create, show, update, destroy } from './controllers/v1/talents'
import { all, create, show, redirectTwitter } from './controllers/v1/talents'
import { callbacksTwitter } from './controllers/v1/callbacks/twitter'

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
  app.get('/talents/:id/actions/redirect_twitter', redirectTwitter)
  /* Callbacks */
  app.get('/callbacks/twitter', callbacksTwitter)
}
