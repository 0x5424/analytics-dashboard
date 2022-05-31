import { Request, Response } from 'express'
import { getDatabase, ServerValue } from 'firebase-admin/database'
import { TwitterApi } from 'twitter-api-v2'

import { handleError } from '../utils/errors'

export const callbacksTwitter = async (req: Request, res: Response) => {
  try {
    const { state, code } = req.query
    const { talentId, codeVerifier, state: sessionState } = req.signedCookies

    if (!talentId || !codeVerifier || !state || !sessionState || !code) {
      return res.status(400).send('Permission was not granted; Please retry the authorization flow')
    }

    if (state !== sessionState) {
      return res.status(400).send('Invalid token; Please retry the authorization flow');
    }

    let found = false

    await getDatabase().ref(`/talents/${talentId}`).once('value', (snapshot) => {
      found = !!snapshot.val()
    })

    if (!found) return res.status(404).send({ message: 'Not found' })

    // Else, fetch an access_token and refresh_token & persist in DB

    const { client, accessToken, refreshToken, expiresIn } = await new TwitterApi({
      clientId: process.env.TWITTER_API_KEY,
      clientSecret: process.env.TWITTER_API_SECRET
    }).loginWithOAuth2({ code: `${code}`, codeVerifier, redirectUri: process.env.TWITTER_REDIRECT_URL })

    const {
      data: {
        id: twitterId,
        username,
      }
    } = await client.v2.me()

    // 1. Persist tokens
    await getDatabase().ref(`/twitters/${twitterId}`).set({
      screen_name: username,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
      timestamp: ServerValue.TIMESTAMP,
      created_at: ServerValue.TIMESTAMP
    })

    // 2. Update user ref
    await getDatabase().ref(`/talents/${talentId}`).update({
      twitter_user_id: twitterId,
      timestamp: ServerValue.TIMESTAMP
    })

    return res.send(`Successfully linked @${username}. You can safely close this page.`)
  } catch (err) {
    return handleError(res, err)
  }
}
