import {Application} from 'express'
// import { all, create, show, update, destroy } from './controllers/v1/talents'
import {redirectTwitter} from './controllers/v1/talents/redirect-twitter'
import {callbacksTwitter} from './controllers/v1/callbacks/twitter'
import {analyzeTweet} from './controllers/v1/actions/analyze-tweet'
import {isAuthenticated} from './controllers/v1/utils/auth'

/**
 * Accepts an express app & applies the v1 function routing
 */
export const routesV1 = (app: Application): void => {
  /* Talent resources */
  app.get('/talents/:id/actions/redirect_twitter', redirectTwitter)
  /* Callbacks */
  app.get('/callbacks/twitter', callbacksTwitter)
  /* Third party integrations */
  app.post('/actions/analyze_tweet', [isAuthenticated, analyzeTweet])
}
