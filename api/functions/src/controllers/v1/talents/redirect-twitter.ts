import { Request, Response } from 'express'
import { getDatabase } from 'firebase-admin/database'
import { TwitterApi } from 'twitter-api-v2'

import { handleError } from '../utils/errors'

export const redirectTwitter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    let found = false

    await getDatabase().ref(`/talents/${id}`).once('value', (snapshot) => {
      found = !!snapshot.val()
    })

    if (!found) return res.status(404).send({ message: 'Not found' })

    // Else, begin 3-legged OAuth access_token request
    const client = new TwitterApi({ clientId: process.env.TWITTER_API_KEY, clientSecret: process.env.TWITTER_API_SECRET })
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      process.env.TWITTER_REDIRECT_URL,
      { scope: ['tweet.read', 'users.read', 'offline.access'] }
    )
    const cookieOptions = {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 30 // 30 mins
    }
    // Persist the talent_id, state, codeVerifier in a signed, encrypted cookie
    res.cookie('talent_id', id, cookieOptions)
    res.cookie('codeVerifier', codeVerifier, cookieOptions)
    res.cookie('state', state, cookieOptions)

    return res.redirect(url)
  } catch (err) {
    return handleError(res, err)
  }
}
