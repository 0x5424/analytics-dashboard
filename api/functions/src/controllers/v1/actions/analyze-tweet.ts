import * as functions from 'firebase-functions'
import {Request, Response} from 'express'
import {getDatabase, ServerValue} from 'firebase-admin/database'
import type {TTweetv2TweetField, TTweetv2MediaField, TTweetv2Expansion} from 'twitter-api-v2'
import {TwitterApi} from 'twitter-api-v2'

import {handleError} from '../utils/errors'

const TWEET_FIELDS: TTweetv2TweetField[] = [
  'public_metrics',
  'non_public_metrics',
  'organic_metrics',
]

const PROMOTED: TTweetv2TweetField = 'promoted_metrics'

const MEDIA_FIELDS: TTweetv2MediaField[] = [
  'public_metrics',
  'non_public_metrics',
  'organic_metrics',
]

const MEDIA_EXPANSIONS: TTweetv2Expansion[] = ['attachments.media_keys']

interface TwitterCredentials {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  timestamp: number;
}

export const analyzeTweet = async (req: Request, res: Response) => {
  try {
    const {twitterId, tweetUrl} = req.body?.data || {}
    if (!twitterId || !tweetUrl) return res.status(400).send({message: 'Missing fields'})

    const includePromoted = req.body.data?.promoted || false
    /**
     * Format:
     * ```
     * ['', 'simpleflips', 'status', '1336022100654485504']
     * ```
     */
    // const [_, _user, _status, tweetId] = new URL(tweetUrl).pathname
    const [, , , tweetId] = new URL(tweetUrl).pathname.split('/')

    let twitter: TwitterCredentials | undefined

    await getDatabase().ref(`/twitters/${twitterId}`).once('value', (snapshot) => {
      twitter = snapshot.val() as TwitterCredentials | undefined
    })

    if (!twitter) return res.status(404).send({message: 'Not found'})

    /**
     * Timestamps saved in ms, twitter.expires_in saved in seconds
     */
    const shouldRefresh = (twitter.timestamp + (twitter.expires_in * 1000)) < Date.now()

    let validAccessToken = twitter.access_token
    if (shouldRefresh) {
      const refreshClient = new TwitterApi({
        clientId: process.env.TWITTER_API_KEY,
        clientSecret: process.env.TWITTER_API_SECRET,
      })

      // 1. Use access_token
      const {accessToken, refreshToken, expiresIn} = await refreshClient.refreshOAuth2Token(twitter.refresh_token)

      // 2. Update DB
      await getDatabase().ref(`/twitters/${twitterId}`).update({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn - 60, // Refresh 1 minute earlier to prevent any differences in server timing
        timestamp: ServerValue.TIMESTAMP,
      })

      // 3. Update scoped token
      validAccessToken = accessToken
    }

    const client = new TwitterApi(validAccessToken)

    const tweet = await client.v2.singleTweet(tweetId, {
      'tweet.fields': includePromoted ? [PROMOTED, ...TWEET_FIELDS] : TWEET_FIELDS,
      'expansions': MEDIA_EXPANSIONS,
      'media.fields': MEDIA_FIELDS,
    })

    functions.logger.log('[analyzeTweet] Response:', tweet)

    const formattedResponse = tweet.errors ? {data: tweet} : tweet

    return res.status(200).send(formattedResponse)
  } catch (err) {
    return handleError(res, err)
  }
}
